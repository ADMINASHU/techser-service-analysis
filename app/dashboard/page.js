"use client";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import DataContext from "../../context/DataContext";
import DataCompile from "./(components)/DataCompile";
import DashboardTableView from "./(components)/DashboardTableView";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const payload = {
      // Add your payload data here
      year: "2024",
    };
    try {
      const response = await axios.post("/api/dashboard", payload);
      // const res = JSON.stringify(response.data);
      setData(response.data);
      // console.log(result);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  return (
    <div>
      <h1>Dashboard Page</h1>
      {/* <DashboardTableView dta={data}/> */}
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default DashboardPage;
