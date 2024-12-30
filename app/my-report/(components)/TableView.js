"use client";

import React, { useContext, useMemo, useState } from 'react';
import DataContext from "@/context/DataContext";
import styles from '../report.module.css';

const TableView = ({ loggedUser }) => {
  const { processedData } = useContext(DataContext);
  
  // Define months array first
  const months = ['ALL', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get current date for initial filter values
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = months[currentDate.getMonth() + 1]; // +1 because months array is 0-based

  const [filters, setFilters] = useState({
    year: currentYear,
    month: currentMonth
  });

  // Get unique years and months from data
  const years = useMemo(() => {
    if (!processedData) return [];
    const uniqueYears = [...new Set(processedData.map(item => item.year))].filter(Boolean);
    return ['ALL', ...uniqueYears.sort((a, b) => b - a)];
  }, [processedData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const calculateUserStats = (data, userID) => {
    // Filter data based on year and month
    let filteredData = data.filter(item => 
      item?.account?.erID && 
      item.account.erID.toLowerCase() === userID?.toLowerCase()
    );

    // Apply year filter
    if (filters.year !== 'ALL') {
      filteredData = filteredData.filter(item => item.year === filters.year);
    }

    // Apply month filter
    if (filters.month !== 'ALL') {
      filteredData = filteredData.filter(item => item.month === filters.month);
    }

    if (!filteredData.length) return null;

    const engineerData = filteredData[0];
    const totalAssigned = filteredData.length;

    // Count calls by status and type
    const stats = {
      newBreakdown: filteredData.filter(item => 
        item.realStatus === "NEW" && item.natureOfComplaint === "BREAKDOWN"
      ).length,
      newInstallation: filteredData.filter(item => 
        item.realStatus === "NEW" && item.natureOfComplaint === "INSTALLATION"
      ).length,
      newPM: filteredData.filter(item => 
        item.realStatus === "NEW" && item.natureOfComplaint === "PM"
      ).length,
      pendBreakdown: filteredData.filter(item => 
        item.realStatus === "IN PROCESS" && item.natureOfComplaint === "BREAKDOWN"
      ).length,
      pendInstallation: filteredData.filter(item => 
        item.realStatus === "IN PROCESS" && item.natureOfComplaint === "INSTALLATION"
      ).length,
      pendPM: filteredData.filter(item => 
        item.realStatus === "IN PROCESS" && item.natureOfComplaint === "PM"
      ).length,
      closeBreakdown: filteredData.filter(item => 
        item.realStatus === "COMPLETED" && item.natureOfComplaint === "BREAKDOWN"
      ).length,
      closeInstallation: filteredData.filter(item => 
        item.realStatus === "COMPLETED" && item.natureOfComplaint === "INSTALLATION"
      ).length,
      closePM: filteredData.filter(item => 
        item.realStatus === "COMPLETED" && item.natureOfComplaint === "PM"
      ).length,
    };

    // Calculate totalVisits
    const openCalls = filteredData.filter(item => 
      !item.closedDate && item.realStatus !== "NEW"
    ).length;
    
    const newCalls = stats.newBreakdown + stats.newInstallation + stats.newPM;
    const totalVisits = totalAssigned - (newCalls + openCalls);

    // Calculate ePoint
    const ePoint = filteredData.reduce((sum, item) => 
      sum + (parseFloat(item.ePoint) || 0), 0
    ).toFixed(2);

    // Calculate accuracy and index
    const closedCalls = stats.closeBreakdown + stats.closeInstallation + stats.closePM;
    const accuracy = totalVisits ? 
      ((100 * closedCalls) / totalVisits).toFixed(2) : "0.00";
    const index = totalVisits ? 
      ((ePoint * 1000) / totalVisits).toFixed(0) : 0;

    return {
      engineer: engineerData.account.erName,
      totalCallAssigned: totalAssigned,
      ...stats,
      totalVisits,
      ePoint,
      index,
      accuracy
    };
  };

  const userData = useMemo(() => {
    if (!processedData || !loggedUser.userID) return null;
    return calculateUserStats(processedData, loggedUser.userID);
  }, [processedData, loggedUser, filters,calculateUserStats]);

  if (!userData) {
    return (
      <div className={styles.statsContainer}>
        <h2>Performance Statistics</h2>
        <div className={styles.filterControls}>
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select name="month" value={filters.month} onChange={handleFilterChange}>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No statistics available</p>
        </div>
      </div>
    );
  }

  const getColor = value => {
    const strPoint = -3000;
    const minPoint = 1000;
    const midPoint = 1800;
    const greenPoint = 2000;
    const maxPoint = 3000;

    if (value <= strPoint) return `rgb(139,0,0)`;
    if (value <= minPoint) {
      const ratio = (value - strPoint) / (minPoint - strPoint);
      return `rgb(255, ${Math.round(64 * ratio)}, ${Math.round(64 * ratio)})`;
    }
    if (value <= midPoint) {
      const ratio = (value - minPoint) / (midPoint - minPoint);
      return `rgb(255, ${Math.round(255 * ratio)}, 0)`;
    }
    if (value <= greenPoint) {
      const ratio = (value - midPoint) / (greenPoint - midPoint);
      return `rgb(${Math.round(255 * (1 - ratio))}, 255, 0)`;
    }
    if (value <= maxPoint) {
      const ratio = (value - greenPoint) / (maxPoint - greenPoint);
      return `rgb(0, ${Math.round(255 * (1 - ratio))}, 0)`;
    }
    return `rgb(0,100,0)`;
  };

  return (
    <div className={styles.statsContainer}>
      <h2>Performance Statistics</h2>
      <div className={styles.filterControls}>
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select name="month" value={filters.month} onChange={handleFilterChange}>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>
      <div className={styles.statsGrid}>
        <div className={styles.statsSection}>
          <h3>New</h3>
          <div className={styles.statsCards}>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Breakdown</span>
              <span className={styles.cardValue}>{userData.newBreakdown}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Installation</span>
              <span className={styles.cardValue}>{userData.newInstallation}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>PM</span>
              <span className={styles.cardValue}>{userData.newPM}</span>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <h3>Pending</h3>
          <div className={styles.statsCards}>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Breakdown</span>
              <span className={styles.cardValue}>{userData.pendBreakdown}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Installation</span>
              <span className={styles.cardValue}>{userData.pendInstallation}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>PM</span>
              <span className={styles.cardValue}>{userData.pendPM}</span>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <h3>Closed</h3>
          <div className={styles.statsCards}>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Breakdown</span>
              <span className={styles.cardValue}>{userData.closeBreakdown}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Installation</span>
              <span className={styles.cardValue}>{userData.closeInstallation}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>PM</span>
              <span className={styles.cardValue}>{userData.closePM}</span>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <h3>Summary</h3>
          <div className={styles.statsCards}>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Total Assigned</span>
              <span className={styles.cardValue}>{userData.totalCallAssigned}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Total Visits</span>
              <span className={styles.cardValue}>{userData.totalVisits}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>E Points</span>
              <span className={styles.cardValue}>{userData.ePoint}</span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Performance Index</span>
              <span className={styles.cardValue} style={{ backgroundColor: getColor(userData.index) }}>
                {userData.index}
              </span>
            </div>
            <div className={styles.statsCard}>
              <span className={styles.cardLabel}>Accuracy</span>
              <span className={styles.cardValue}>{userData.accuracy}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default TableView;