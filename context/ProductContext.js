"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import connectToServiceEaseDB from "../lib/serviceDB";
import CPData from "../models/CPData";

const ProductContext = createContext();
const CHUNK_SIZE = 400; // Number of rows to fetch per chunk

export const ProductProvider = ({ children }) => {
  const [cpData, setCpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startRow, setStartRow] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  const fetchCPDataChunk = async (startRow, chunkSize) => {
    try {
      const response = await axios.get(`/api/cpData?startRow=${startRow}&chunkSize=${chunkSize}`);
      if (response.data && !response.data.error) {
        setCpData((prevData) => [...prevData, ...response.data]);
        setTotalRows(response.data.totalRows);
      }
    } catch (error) {
      console.error("Error fetching CPData:", error);
    } finally {
      setLoading(false);
    }
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

  return (
    <ProductContext.Provider value={{ cpData, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
