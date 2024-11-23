"use client";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

// Set the threshold for data freshness (e.g., 6 hours)
const DATA_THRESHOLD_MS = 60 * 60 * 1000;

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
          setDate(cachedTimestamp);
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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        margin: "40px",
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "bold",
        padding: "20px",
        zIndex:"2",
        textShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)"
      }}
    >
      {data.length > 0 ? (
        <div>
          <div
            style={{
              marginBottom: "50px",
            }}
          >
            Fetched Data till Date: 
            {data[data.length - 1]["regDate"]}
          </div>
          <div>Refresh at: {Date(date)}</div>
        </div>
      ) : (
        <Loading />
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
