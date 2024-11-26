"use client";
import Loading from "@/components/Loading";
import { useEffect, useContext, useState } from "react";
import DataContext from "../context/DataContext";

const CHUNK_SIZE = 500; // Number of rows to fetch per chunk

const HomePage = () => {
  const { processedData, setProcessedData } = useContext(DataContext);
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
    <div
      style={{
        // display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        margin: "40px",
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "bold",
        padding: "20px",
        zIndex: "2",
        textShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
      
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
          // width: "600px",
          marginTop: "30vh",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
          padding: "20px",
          zIndex: "2",
          textShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
          // backgroundColor: "green",
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
              {processedData[processedData.length - 1]?.regDate}
            </div>
          </div>
        )}
      </div>
      <div style={{ justifyContent: "center" }}>
        {ch}/{totalRows}
      </div>
    </div>
  );
};

export default HomePage;
