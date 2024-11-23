"use client"
import { useEffect, useState } from "react";

// Set the threshold for data freshness (e.g., 6 hours)
const DATA_THRESHOLD_MS = 6 * 60 * 60 * 1000;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = retrieveDataFromLocalStorage("analysisData");
      const cachedTimestamp = retrieveDataFromLocalStorage("analysisDataTimestamp");

      // Check if cached data exists and is fresh
      if (cachedData && cachedTimestamp) {
        const now = new Date().getTime();
        const age = now - cachedTimestamp;
        if (age < DATA_THRESHOLD_MS) {
          setData(cachedData);
          return;
        }
      }

      // Fetch new data if no cached data or if cached data is outdated
      const response = await fetch("/api/proData");
      const result = await response.json();
      if (response.ok) {
        setData(result);
        storeDataInLocalStorage("analysisData", result);
        storeDataInLocalStorage("analysisDataTimestamp", new Date().getTime());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Get the last row
      const lastRow = data[data.length - 1];
      const value = lastRow[0];
      console.log(value);
      setDate(value);
    }
  }, [data]);

  return (
    <div>
      {data.length > 0 ? (
        <div>
          <p>Fetched Data till Date:
          { data[data.length - 1]["regDate"]}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
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

export default HomePage;
