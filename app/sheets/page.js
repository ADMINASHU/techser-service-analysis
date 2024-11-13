"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Sheets = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [cookies, setCookies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apiURL = "/api/proxy";
      const payload = {
        username: "admin",
        password: "password",
        submit: "",
      };

      try {
        const response = await axios.post(apiURL, payload);
        setData(response.data);

        const setCookiesHeader = response.headers["Set-Cookie"];
        if (setCookiesHeader) {
          setCookies(setCookiesHeader);
        }
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
   
      {cookies.length > 0 && (
        <div>   
          <h2>Cookies</h2>
          <pre>{JSON.stringify(cookies, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Sheets;
