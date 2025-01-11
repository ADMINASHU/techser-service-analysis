"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Control.module.css"; // Import the CSS module
import DataContext from "@/context/DataContext";

const ControlAndDate = () => {
  const [points, setPoints] = useState({});
  const [editing, setEditing] = useState(false);
  const { yearData, setYearData } = useContext(DataContext);

  useEffect(() => {
    fetchPoints();
  }, []);

  useEffect(() => {
    const tableContainer = document.querySelector(`.${styles.tableContainer}`);
    const handleScroll = () => {
      if (tableContainer) {
        const maxScroll = tableContainer.scrollWidth - tableContainer.clientWidth;
        const currentScroll = tableContainer.scrollLeft;
        const scrollPercentage = (currentScroll / maxScroll) * 100;
        tableContainer.style.setProperty('--scroll', `${scrollPercentage}%`);
      }
    };

    tableContainer?.addEventListener('scroll', handleScroll);
    return () => tableContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await axios.get("/api/control");
      setPoints(response.data);
    } catch (error) {
      // console.error("Error fetching points:", error);
    }
  };

  const handleYear = async (e) => {
    const selectedYear = e.target.value;
    try {
      // Update local state immediately
      setYearData((prev) => ({
        ...prev,
        year: selectedYear,
      }));

      const response = await axios.put("/api/years", {
        year: selectedYear,
        selectYears: yearData.selectYears,
      });

      if (response.data && response.data[0]) {
        setYearData(response.data[0]);
      }
    } catch (error) {
      // console.error("Error updating year:", error);
      // Revert on error
      fetchYears();
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/api/control", points);
      // console.log("Save response:", response);
      if (response.status === 200) {
        Swal.fire("Success!", "Data saved successfully!", "success");
        setEditing(false);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      // console.error("Error in handleSave:", error.message); // Use error.message for cleaner logs
      Swal.fire("Error!", "Failed to save data.", "error");
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (category, type, field, index, value) => {
    setPoints((prevPoints) => {
      if (field === "closed" && Array.isArray(prevPoints[category][type].closed)) {
        const newClosed = [...prevPoints[category][type].closed];
        newClosed[index] = Number(value);
        return {
          ...prevPoints,
          [category]: {
            ...prevPoints[category],
            [type]: {
              ...prevPoints[category][type],
              closed: newClosed,
            },
          },
        };
      } else {
        return {
          ...prevPoints,
          [category]: {
            ...prevPoints[category],
            [type]: {
              ...prevPoints[category][type],
              [field]: Number(value),
            },
          },
        };
      }
    });
  };

  const displayClosedValue = (closed) => {
    return Array.isArray(closed) ? closed.join(", ") : closed;
  };

  return (
    <div className={styles.page}>
      {/* <h1>Control Page</h1> */}
      <div className={styles["button-container"]}>
        <button className={styles["button"]} onClick={editing ? handleSave : handleEdit}>
          {editing ? "Save" : "Edit"}
        </button>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.scrollIndicator}></div>
        <table className={styles["table"]}>
          <colgroup>
            <col /> 
          </colgroup>
          <colgroup className={styles.columnGroup}>
            <col span="3" />
          </colgroup>
          <colgroup className={styles.columnGroup}>
            <col span="3" /> 
          </colgroup>
          <colgroup className={styles.columnGroup}>
            <col span="5" /> 
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2}>Category</th>
              <th colSpan={3}>New</th>
              <th colSpan={3}>Pending</th>
              <th colSpan={5}>Closed</th>
            </tr>
            <tr>
              <th>Eng</th>
              <th>Branch</th>
              <th>Region</th>
              <th>Eng</th>
              <th>Branch</th>
              <th>Region</th>
              <th>1st Visit</th>
              <th>2nd & 3rd Visit</th>
              <th>After 3rd Visit</th>
              <th>Branch</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(points).map((category) => (
              <tr key={category}>
                <td>{category}</td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].eng.new}
                      onChange={(e) => handleChange(category, "eng", "new", 0, e.target.value)}
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>{points[category].eng.new}</span>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].branch.new}
                      onChange={(e) => handleChange(category, "branch", "new", 0, e.target.value)}
                      className={styles["input-field"]}
                    />
                  ) : (
                    <>
                      <span className={styles["input-field"]}>{points[category].branch.new}</span>
                      {category === "BREAKDOWN" && <span>/ day; after 3 day</span>}
                    </>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].region.new}
                      onChange={(e) => handleChange(category, "region", "new", 0, e.target.value)}
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>{points[category].region.new}</span>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].eng.pending}
                      onChange={(e) => handleChange(category, "eng", "pending", 0, e.target.value)}
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>{points[category].eng.pending}</span>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].branch.pending}
                      onChange={(e) =>
                        handleChange(category, "branch", "pending", 0, e.target.value)
                      }
                      className={styles["input-field"]}
                    />
                  ) : (
                    <>
                      <span className={styles["input-field"]}>
                        {points[category].branch.pending}
                      </span>
                      {category === "BREAKDOWN" ? (
                        <span>/ day; after 3 day</span>
                      ) : (
                        <span> per visit</span>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].region.pending}
                      onChange={(e) =>
                        handleChange(category, "region", "pending", 0, e.target.value)
                      }
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>{points[category].region.pending}</span>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].eng.closed[0]}
                      onChange={(e) => handleChange(category, "eng", "closed", 0, e.target.value)}
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>{points[category].eng.closed[0]}</span>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].eng.closed[1]}
                      onChange={(e) => handleChange(category, "eng", "closed", 1, e.target.value)}
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>{points[category].eng.closed[1]}</span>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={points[category].eng.closed[2]}
                      onChange={(e) => handleChange(category, "eng", "closed", 2, e.target.value)}
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>{points[category].eng.closed[2]}</span>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={displayClosedValue(points[category].branch.closed)}
                      onChange={(e) =>
                        handleChange(category, "branch", "closed", 0, e.target.value)
                      }
                      className={styles["input-field"]}
                    />
                  ) : (
                    <>
                      <span className={styles["input-field"]}>
                        {displayClosedValue(points[category].branch.closed)}
                      </span>
                      {category === "BREAKDOWN" ? (
                        <span>/ day; after 3 day</span>
                      ) : (
                        <span> per visit</span>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="number"
                      value={displayClosedValue(points[category].region.closed)}
                      onChange={(e) =>
                        handleChange(category, "region", "closed", 0, e.target.value)
                      }
                      className={styles["input-field"]}
                    />
                  ) : (
                    <span className={styles["input-field"]}>
                      {displayClosedValue(points[category].region.closed)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.yearSelectionContainer}>
          <h2>Select the year for Dashboard</h2>
          <select 
            name="year" 
            value={yearData.year || ""} 
            onChange={handleYear}
            className={styles.yearSelect}
          >
            <option value="">Select Year</option>
            {yearData.selectYears?.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ControlAndDate;
