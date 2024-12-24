import React, { useState, useEffect, useRef } from "react";
import ProfileCard from "./ProfileCard"; // Import the ProfileCard component
import styles from "../../Dashboard.module.css";
import { regionList } from "@/lib/regions";
import axios from "axios";

const DashboardTableView = ({ data, averageTotalVisits }) => {
  const tableRef = useRef();
  const [smartFilter, setSmartFilter] = useState(false);
  const [filters, setFilters] = useState({
    region: "ALL Region",
    branch: "ALL Branch",
    engineer: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [profileData, setProfileData] = useState(null);
  const [profilePosition, setProfilePosition] = useState({ top: 0, left: 0 });
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("/api/users");
      setUsers(response.data.users);
    };
    fetchUsers();
  }, []);

  const selectedColumns = [
    "engineer",
    "totalCallAssigned",
    "newBreakdown",
    "newInstallation",
    "newPM",
    "pendBreakdown",
    "pendInstallation",
    "pendPM",
    "closeBreakdown",
    "closeInstallation",
    "closePM",
    "pCloseBreakdown",
    "pCloseInstallation",
    "pClosePM",
    "totalVisits",
    "ePoint",
    "index",
    "accuracy",
  ];

  const getBranchesForRegion = (region) => {
    const branches = new Set();
    data.forEach((row) => {
      if (region === "ALL Region" || row.region === region) {
        branches.add(row.branch);
      }
    });
    return Array.from(branches);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSmartFilterToggle = () => {
    setSmartFilter((prevSmartFilter) => !prevSmartFilter);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let newFilteredData;

    if (smartFilter) {
      newFilteredData = data
        .filter((row) => row.region !== "Region")
        .filter((row) => {
          return (
            filters.region === "ALL Region" || !filters.region || row.region === filters.region
          );
        })
        .filter((row) => {
          return (
            filters.branch === "ALL Branch" || !filters.branch || row.branch === filters.branch
          );
        })
        .filter((row) => row.engineer.toLowerCase().includes(filters.engineer.toLowerCase()))
        .filter((row) => row.totalVisits > averageTotalVisits);
    } else {
      newFilteredData = data
        .filter((row) => row.region !== "Region")
        .filter((row) => {
          return (
            filters.region === "ALL Region" || !filters.region || row.region === filters.region
          );
        })
        .filter((row) => {
          return (
            filters.branch === "ALL Branch" || !filters.branch || row.branch === filters.branch
          );
        })
        .filter((row) => row.engineer.toLowerCase().includes(filters.engineer.toLowerCase()));
    }

    if (sortConfig.key) {
      newFilteredData = [...newFilteredData].sort((a, b) => {
        const aValue = isNaN(a[sortConfig.key]) ? a[sortConfig.key] : parseFloat(a[sortConfig.key]);
        const bValue = isNaN(b[sortConfig.key]) ? b[sortConfig.key] : parseFloat(b[sortConfig.key]);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(newFilteredData);
  }, [data, filters, smartFilter, sortConfig, averageTotalVisits]);

  const getColor = (value) => {
    const strPoint = -3000;
    const minPoint = 1000;
    const midPoint = 1800;
    const greenPoint = 2000;
    const maxPoint = 3000;

    if (value <= strPoint) {
      return `rgb(139,0,0)`; // Dark red for very low values
    } else if (value <= minPoint) {
      const ratio = (value - strPoint) / (minPoint - strPoint);
      return `rgb(255, ${Math.round(64 * ratio)}, ${Math.round(64 * ratio)})`; // Gradient from dark red to light red
    } else if (value <= midPoint) {
      const ratio = (value - minPoint) / (midPoint - minPoint);
      return `rgb(255, ${Math.round(255 * ratio)}, 0)`; // Gradient from light red to light green
    } else if (value <= greenPoint) {
      const ratio = (value - midPoint) / (greenPoint - midPoint);
      return `rgb(${Math.round(255 * (1 - ratio))}, 255, 0)`; // Gradient from light green to green
    } else if (value <= maxPoint) {
      const ratio = (value - greenPoint) / (maxPoint - greenPoint);
      return `rgb(0, ${Math.round(255 * (1 - ratio))}, 0)`; // Gradient from green to dark green
    } else {
      return `rgb(0,100,0)`; // Dark green for values above maxPoint
    }
  };

  const handlePrint = () => {
    const printContent = tableRef.current;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(
      ` <html> 
      <head> 
      <title>Print Table</title> 
      <style> 
      table { width: 100%; border-collapse: collapse; } 
      th, td { border: 1px solid black; padding: 8px; text-align: left; }
       </style> 
       </head> 
       <body> ${printContent.outerHTML} </body>
        </html> `
    );
    printWindow.document.close();
    printWindow.print();
  };

  const handleCellClick = (event, colIndex, rowData) => {
    if (colIndex === 0) {
      const existingUsers = users.filter(
        (user) => user.userID.toLowerCase() === rowData.account.erID.toLowerCase()
      );
      if (existingUsers.length > 0) {
        const newData = {
          ...rowData,
          account: {
            ...rowData.account,
            image: "user.png",
            erEmail: existingUsers[0].email,
            erName: `${existingUsers[0].fName} ${existingUsers[0].eName}`,
            erMob: existingUsers[0].mobileNo,
          },
        };
        setProfileData(newData);
      } else {
        setProfileData({ ...rowData, account: { ...rowData.account, image: "ashu_user1.png" } });
      }
      setProfilePosition({ top: `${event.clientY}px`, left: `${event.clientX}px` });
      document.body.classList.add(styles.blurredBackground);
    }
  };

  const closeProfileCard = () => {
    setProfileData(null);
    document.body.classList.remove(styles.blurredBackground);
  };

  if (!data || data.length === 0) return <div>No data available</div>;
  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <button
          className={styles.button}
          style={
            smartFilter
              ? { backgroundColor: "green", color: "white", textAlign: "center" }
              : { backgroundColor: "#e90c0c", color: "white", textAlign: "center" }
          }
          onClick={handleSmartFilterToggle}
        >
          {smartFilter ? "Smart" : "Regular"}
        </button>
  
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="ALL Region">ALL Region</option>
          {regionList.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
  
        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
          <option value="ALL Branch">ALL Branch</option>
          {getBranchesForRegion(filters.region).map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
  
        <input
          type="text"
          name="engineer"
          value={filters.engineer}
          placeholder="Search Engineer"
          onChange={handleFilterChange}
        />
        <button className={styles.print} onClick={handlePrint}>
          Print
        </button>
      </div>
  
      <table ref={tableRef}>
        <thead>
          <tr>
            <th colSpan={2}>Dashboard Engineer</th>
            <th colSpan={1}>Assigned</th>
            <th colSpan={3}>New</th>
            <th colSpan={3}>Pending</th>
            <th colSpan={3}>Closed in 1st Attempt</th>
            <th colSpan={3}>Pending Call Closed</th>
            <th colSpan={2}>Total</th>
            <th colSpan={1}>Index</th>
            <th colSpan={1}>Accuracy</th>
          </tr>
          {data?.length > 0 && (
            <tr>
              <th>S.No.</th>
              {selectedColumns.map((col, index) => (
                <th key={index} onClick={() => handleSort(col)}>
                  {data[0][col]}{" "}
                  {sortConfig.key === col ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {filteredData?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className={styles.hoverColumn}>{rowIndex + 1}</td>
              {selectedColumns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={colIndex === 0 ? styles.hoverColumn : ""}
                  style={colIndex === 16 ? { backgroundColor: getColor(row[col]) } : {}}
                  onClick={(event) => handleCellClick(event, colIndex, row)}
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  
      {profileData && (
        <ProfileCard data={profileData} onClose={closeProfileCard} position={profilePosition} />
      )}
    </div>
  );
};

export default DashboardTableView;