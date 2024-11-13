"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Cookies = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [cookie, setCookie] = useState("");

  useEffect(() => {
    const fetchCookies = async () => {
      const apiURL = "/api/webapp";
      try {
        const response = await axios.get(apiURL);
        setCookie(response.data);
        return response.data;
      } catch (err) {
        setError("Error fetching data from the server");
        console.error(err);
      }
    };
    const fetchData = async () => {
      const apiURL2 = "/api/serviceease";
      const payload = {
        month: 11,
        year: 2024,
        region: "",
        branch: "",
        type: "All",
        callstatus: "",
      };
      const cookies = await fetchCookies();
      const send = { payload, cookies };
      try {
        const response2 = await axios.post(apiURL2, send);
        consol.log(response2.data);
        setData(response2.data);
      } catch (err) {
        setError("Error fetching data from the server");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Server Data</h1>
      {error && <p>{error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading data...</p>}

      <h2>Cookies</h2>
      {cookie.length > 0 && (
        <div>
          <pre>{JSON.stringify(cookie, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Cookies;
