"use client";
import { createContext, useState, useEffect } from "react";

const CustomerContext  = createContext();
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

const mergeProductsByProdId = (data) => {
  const mergedData = data.reduce((acc, item) => {
    const existingItem = acc.find((prod) => prod.prodId === item.prodId);
    if (existingItem) {
      existingItem.breakdown += item.breakdown;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);
  return mergedData;
};

const mergeCustomersByCustId = (data) => {
  const mergedData = data.reduce((acc, item) => {
    const existingItem = acc.find((cust) => cust.custId === item.custId);
    if (existingItem) {
      existingItem.breakdown += item.breakdown;
      existingItem.installation += item.installation;
      existingItem.pm += item.pm;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);
  return mergedData;
};

export const CustomerProvider = ({ children }) => {
  const [cpData, setCpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startRow, setStartRow] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({
    region: "",
    branch: "",
    name: "",
    category: "",
    series: "",
    model: "",
    capacity: "",
  });

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

  const customerData = cpData.map((item) => {
    return {
      custId: item.custId,
      customerName: item.customerName,
      customerAddress: item.customerAddress,
      pincode: item.pincode,
      state: item.state,
      region: item.region,
      branch: item.branch,
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

  const productData = cpData.map((item) => {
    return {
      region: item.region,
      branch: item.branch,
      prodId: item.prodId,
      prodDescription: item.prodDescription,
      name: item.name,
      category: item.category,
      series: item.series,
      model: item.model,
      capacity: item.capacity,
      capacityUnit: item.capacityUnit,
      breakdown: item.breakdown,
    };
  });

  const filteredProductData = mergeProductsByProdId(productData).filter((item) => {
    return (
      (filters.region === "" || item.region === filters.region) &&
      (filters.branch === "" || item.branch === filters.branch) &&
      (filters.name === "" || item.name === filters.name) &&
      (filters.category === "" || item.category === filters.category) &&
      (filters.series === "" || item.series === filters.series) &&
      (filters.model === "" || item.model === filters.model) &&
      (filters.capacity === "" || item.capacity === filters.capacity)
    );
  });

  const filteredCustomerData = mergeCustomersByCustId(customerData).filter((item) => {
    return (
      (filters.region === "" || item.region === filters.region) &&
      (filters.branch === "" || item.branch === filters.branch) &&
      (filters.name === "" || item.name === filters.name) &&
      (filters.category === "" || item.category === filters.category) &&
      (filters.series === "" || item.series === filters.series) &&
      (filters.model === "" || item.model === filters.model) &&
      (filters.capacity === "" || item.capacity === filters.capacity)
    );
  });

  // console.log(productData);
  return (
    <CustomerContext.Provider value={{ productData: filteredProductData, customerData: filteredCustomerData, loading, filters, setFilters }}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerContext;
