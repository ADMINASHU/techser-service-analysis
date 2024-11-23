"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/stest");
        // const result = JSON.stringify(response.data);
        // console.log(result);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, []);


  return (
    <div>
      <h1>Complaint Data</h1>
      {JSON.stringify(data)}
    </div>
  );
};

export default HomePage;
