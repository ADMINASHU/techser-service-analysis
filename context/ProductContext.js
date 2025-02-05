"use client";
import { createContext, useState, useEffect } from "react";

const ProductContext = createContext();
const CHUNK_SIZE = 400; // Number of rows to fetch per chunk

const addComplaintCounts = (data) => {
  return data.map((item) => {
    const breakdown = item.callIds.filter((call) => call.natureOfComplaint === "BREAKDOWN").length;
    const installation = item.callIds.filter(
      (call) => call.natureOfComplaint === "INSTALLATION"
    ).length;
    const pm = item.callIds.filter((call) => call.natureOfComplaint === "PM").length;
    return {
      ...item,
      breakdown,
      installation,
      pm,
    };
  });
};

export const ProductProvider = ({ children }) => {
  const [cpData, setCpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startRow, setStartRow] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  const fetchCPDataChunk = async (startRow, chunkSize) => {
    try {
      const response = await fetch(`/api/cpData?startRow=${startRow}&chunkSize=${chunkSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (!result.error) {
        setCpData((prevData) => {
          const updatedData = [...prevData, ...result.finalData];
          const uniqueFinalData = removeDuplicates(updatedData, "id");
          const finalDataWithCounts = addComplaintCounts(uniqueFinalData);
          return finalDataWithCounts;
        });
        setTotalRows(result.totalRows);
      }
    } catch (error) {
      console.error("Error fetching CPData:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeDuplicates = (array, key) => {
    const seen = new Set();
    return array.filter((item) => {
      const duplicate = seen.has(item[key]);
      seen.add(item[key]);
      return !duplicate;
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await fetchCPDataChunk(0, CHUNK_SIZE);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (startRow < totalRows || totalRows === 0) {
      setLoading(true);
      const timer = setTimeout(async () => {
        await fetchCPDataChunk(startRow, CHUNK_SIZE);
        setStartRow((prevStartRow) => prevStartRow + CHUNK_SIZE);
      }, 50); // Adding a slight delay to prevent too many rapid requests

      return () => clearTimeout(timer);
    }
  }, [startRow, totalRows]);

  const productData = cpData.map((item) => {
    return {
      custId: item.custId,
      customerName: item.customerName,
      customerAddress: item.customerAddress,
      region: item.region,
      branch: item.branch,
      serialNo: item.serialNo,
      prodId: item.prodId,
      prodDescription: item.prodDescription,
      name: item.name,
      category: item.category,
      series: item.series,
      model: item.model,
      capacity: item.capacity,
      capacityUnit: item.capacityUnit,
      breakdown: item.breakdown,
      installation: item.installation,
      pm: item.pm,
    };
  });

  console.log(productData);
  return (
    <ProductContext.Provider value={{ productData, loading }}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
