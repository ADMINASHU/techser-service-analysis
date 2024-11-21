"use client";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import DataContext from "../../context/DataContext";
import DataCompile from "./(components)/DataCompile";
import DashboardTableView from "./(components)/DashboardTableView";

const DashboardPage = () => {
  // const { processedData } = useContext(DataContext);
  const [result, setResult] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      const response = await axios.get("/api/proData");
      const res = JSON.stringify(response.data);
      setResult(res);
      // console.log(result);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  return (
    <div>
      <h1>Dashboard Page</h1>
      {JSON.stringify(result)}
    </div>
  );
};

export default DashboardPage;
