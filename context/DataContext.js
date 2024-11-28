'use client';

import { createContext, useState, useEffect } from 'react';

const DataContext = createContext();

const CHUNK_SIZE = 500; // Number of rows to fetch per chunk

export const DataProvider = ({ children, isAuthenticated }) => {
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startRow, setStartRow] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [ch, setChSize] = useState(0);

  const fetchDataChunk = async (startRow, chunkSize) => {

    try {
      const response = await fetch(`/api/proData?startRow=${startRow}&chunkSize=${chunkSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.error) {
        console.error("Error fetching data:", result.error);
      } else {
        setProcessedData((prevData) => [
          ...prevData,
          ...result.finalPointData.map((item) => ({
            complaintID: item.complaintID,
            natureOfComplaint: item.natureOfComplaint,
            regDate: item.regDate,
            closedDate: item.closedDate,
            duration: item.duration,
            realStatus: item.realStatus,
            assignedTo: item.assignedTo,
            region: item.region,
            branch: item.branch,
            month: item.month,
            year: item.year,
            count: item.count,
            isPending: item.isPending,
            cPoint: parseFloat(item.cPoint),
            ePoint: parseFloat(item.ePoint),
            bPoint: parseFloat(item.bPoint),
            rPoint: parseFloat(item.rPoint),
          })),
        ]);
        setChSize(ch + result.finalPointData.length);
        setTotalRows(result.totalRows);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
        setStartRow((prevStartRow) => prevStartRow + CHUNK_SIZE);
      }, 500); // Adding a slight delay to prevent too many rapid requests

      return () => clearTimeout(timer);
    }
  }, [startRow, totalRows]);

  return (
    <DataContext.Provider value={{ processedData, setProcessedData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
