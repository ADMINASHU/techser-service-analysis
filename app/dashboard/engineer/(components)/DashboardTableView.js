import React, { useState, useEffect, useRef } from "react";
import ProfileCard from "./ProfileCard"; // Import the ProfileCard component
import styles from "../../Dashboard.module.css";
import { regionList } from "@/lib/regions";
import axios from "axios";

const DashboardTableView = ({ data, averageTotalVisits, filterYear }) => {
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
  const [users, setUsers] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [mouseOnClick, setMouseOnClick] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

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
      if ((region === "ALL Region" || row.region === region) && row.branch !== "Branch") {
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
    if (!filters.region || filters.region === "ALL Region") {
      setFilters((prevFilters) => ({ ...prevFilters, branch: "", engineer: "" }));
    }
  }, [filters.region]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let newFilteredData;

    if (smartFilter) {
      newFilteredData = data
        .filter((row) => row.region !== "Region")
        .filter((row) => row.branch !== "Branch")
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
        .filter((row) => row.region !== "Region" && row.branch !== "Branch")
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

  const handleCellMouseOnClick = (event, colIndex, rowData) => {
    if (colIndex === 0) {
      setHoveredCell(rowData);
      setMouseOnClick(rowData);
      const existingUsers = users?.filter(
        (user) => user.userID.toLowerCase() === rowData.account.erID.toLowerCase()
      );
      if (existingUsers?.length > 0) {
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
    }
  };

  const handleCellMouseEnter = (event, colIndex, rowData) => {
    if (colIndex === 0) {
      setHoveredCell(rowData);
      setHoveredRow(null);

      const existingUsers = users?.filter(
        (user) => user.userID.toLowerCase() === rowData.account.erID.toLowerCase()
      );
      if (existingUsers?.length > 0) {
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
    }
  };

  const handleCellMouseLeave = () => {
    if (!mouseOnClick) {
      setHoveredCell(null);
      setProfileData(null);
    }
  };

  const handleRowMouseEnter = (rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  if (!data || data.length === 0) return <div>No data available</div>;
  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <label className={styles.toggleSwitch}>
          <input type="checkbox" checked={smartFilter} onChange={handleSmartFilterToggle} />
          <span className={styles.slider}>
            <span className={styles.toggleText}>{smartFilter ? "Smart" : "Regular"}</span>
          </span>
        </label>

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
          {getBranchesForRegion(filters.region).map((branch, index) => (
            <option key={index} value={branch}>
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

      <div className={styles.tableContainer}>
        <table ref={tableRef}>
          <thead>
            <tr>
              <th
                colSpan={2}
                className={styles.tableHeader}
              >{`Dashboard Engineer [${filterYear}]`}</th>
              <th colSpan={1} className={styles.tableHeader}>
                Assigned
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                New
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                Pending
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                Closed in 1st Attempt
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                Pending Call Closed
              </th>
              <th colSpan={2} className={styles.tableHeader}>
                Total
              </th>
              <th colSpan={1} className={styles.tableHeader}>
                Index
              </th>
              <th colSpan={1} className={styles.tableHeader}>
                Accuracy
              </th>
            </tr>
            {data?.length > 0 && (
              <tr>
                <th className={styles.tableHeader}>S.No.</th>
                {selectedColumns.map((col, index) => (
                  <th key={index} onClick={() => handleSort(col)} className={styles.tableHeader}>
                    {data[0][col]}
                    {sortConfig.key === col ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {filteredData?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={styles.tableRow}
                onMouseEnter={() => handleRowMouseEnter(rowIndex)}
                onMouseLeave={handleRowMouseLeave}
              >
                <td className={hoveredRow === rowIndex ? styles.activeCell : ""}>{rowIndex + 1}</td>
                {selectedColumns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    style={colIndex === 16 ? { backgroundColor: getColor(row[col]) } : {}}
                    className={`${styles.tableCell} ${colIndex === 0 ? styles.hoverColumn : ""} ${
                      hoveredRow === rowIndex ? styles.activeCell : ""
                    }`}
                    onClick={(event) => handleCellMouseOnClick(event, colIndex, row)}
                    onMouseEnter={(event) => handleCellMouseEnter(event, colIndex, row)}
                    onMouseLeave={handleCellMouseLeave}
                  >
                    <div className={styles.tableCellContent}>{row[col]}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {profileData && (hoveredCell || mouseOnClick) && (
        <div className={`${styles.modalOverlay} ${mouseOnClick ? styles.modalOverlay2 : ""}`}>
          <div className={styles.cardContainer}>
            <ProfileCard
              data={profileData}
              onClose={() => {
                setProfileData(null);
                setHoveredCell(null);
                setMouseOnClick(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTableView;
