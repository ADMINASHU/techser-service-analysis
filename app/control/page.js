"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Control.module.css"; // Import the CSS module

const Control = () => {
  const [points, setPoints] = useState({});
  const [editing, setEditing] = useState(false);
  // const [data, setData] = useState([]);

  useEffect(() => {
    fetchPoints();
    updateData();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await axios.get("/api/control");
      setPoints(response.data);
      updateData();
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };
  const updateData = async () => {
    try {
      // Fetch new data if no cached data or if cached data is outdated
      const response = await fetch("/api/proData");
      const result = await response.json();
      if (response.ok) {
        //  setData(result);
        storeDataInLocalStorage("analysisData", result);
        storeDataInLocalStorage("analysisDataTimestamp", new Date().getTime());
      }
    } catch (e) {
      console.log(e.errors);
    }
  };
  const handleSave = async () => {
    try {
      const response = await axios.put("/api/control", points);
      console.log("Save response:", response);
      if (response.status === 200) {
        Swal.fire("Success!", "Data saved successfully!", "success");
        setEditing(false);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in handleSave:", error.message); // Use error.message for cleaner logs
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
      <h1>Control Page</h1>
      <div className={styles["button-container"]}>
        <button className={styles["button"]} onClick={editing ? handleSave : handleEdit}>
          {editing ? "Save" : "Edit"}
        </button>
      </div>
      <table className={styles["table"]}>
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
                  <span className={styles["input-field"]}>{points[category].branch.new}</span>
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
                    onChange={(e) => handleChange(category, "branch", "pending", 0, e.target.value)}
                    className={styles["input-field"]}
                  />
                ) : (
                  <span className={styles["input-field"]}>{points[category].branch.pending}</span>
                )}
              </td>
              <td>
                {editing ? (
                  <input
                    type="number"
                    value={points[category].region.pending}
                    onChange={(e) => handleChange(category, "region", "pending", 0, e.target.value)}
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
                    onChange={(e) => handleChange(category, "branch", "closed", 0, e.target.value)}
                    className={styles["input-field"]}
                  />
                ) : (
                  <span className={styles["input-field"]}>
                    {displayClosedValue(points[category].branch.closed)}
                  </span>
                )}
              </td>
              <td>
                {editing ? (
                  <input
                    type="number"
                    value={displayClosedValue(points[category].region.closed)}
                    onChange={(e) => handleChange(category, "region", "closed", 0, e.target.value)}
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
  );
};

const storeDataInLocalStorage = (key, data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const retrieveDataFromLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export default Control;
