"use client";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

// Set the threshold for data freshness (e.g., 6 hours)
const DATA_THRESHOLD_MS = 60 * 60 * 1000;
const CHUNK_SIZE = 500; // Number of rows to fetch per chunk

const HomePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startRow, setStartRow] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [date, setDate] = useState(null);

  const fetchDataChunk = async (startRow, chunkSize) => {
    try {
      const response = await fetch(`/api/proData?startRow=${startRow}&chunkSize=${chunkSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.error) {
        console.error('Error fetching data:', result.error);
      } else {
        setData(prevData => [...prevData, ...result.finalPointData]);
        setTotalRows(result.totalRows);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = retrieveDataFromLocalStorage("analysisData");
      const cachedTimestamp = retrieveDataFromLocalStorage("analysisDataTimestamp");

      if (cachedData && cachedTimestamp) {
        const now = new Date().getTime();
        const age = now - cachedTimestamp;
        if (age < DATA_THRESHOLD_MS) {
          setData(cachedData);
          setDate(new Date(cachedTimestamp));
          setLoading(false);
          return;
        }
      }

      // Start fetching the first chunk
      await fetchDataChunk(0, CHUNK_SIZE);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (startRow < totalRows || totalRows === 0) {
      setLoading(true);
      const timer = setTimeout(async () => {
        await fetchDataChunk(startRow, CHUNK_SIZE);
        setStartRow(prevStartRow => prevStartRow + CHUNK_SIZE);
      }, 500); // Adding a slight delay to prevent too many rapid requests

      return () => clearTimeout(timer);
    }
  }, [startRow, totalRows]);

  useEffect(() => {
    if (data.length > 0) {
      storeDataInLocalStorage('analysisData', data);
      storeDataInLocalStorage('analysisDataTimestamp', new Date().getTime());
    }
  }, [data]);

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
        zIndex: "2",
        textShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)"
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div
            style={{
              marginBottom: "50px",
            }}
          >
            Fetched Data till Date: 
            {data[data.length - 1]?.regDate}
          </div>
          <div>Refresh at: {date ? date.toLocaleString() : "N/A"}</div>
        </div>
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
