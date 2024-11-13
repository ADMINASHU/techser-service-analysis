"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Cookies = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [cookie, setCookie] = useState("");

  useEffect(() => {
    const parseHTMLTable = (html) => {
        var data = [];
        var tableRegex = /<table[^>]*>(.*?)<\/table>/s;  // Changed to stop after the first table
        var rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
        var cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/gs;
        var tableMatch = tableRegex.exec(html);
        if (tableMatch) {
          var rows = tableMatch[1].match(rowRegex);
          rows.forEach(function(row) {
            var cells = row.match(cellRegex);
            var rowData = cells.map(function(cell) {
              return cell.replace(/<.*?>/g, '').trim();
            });
            data.push(rowData);
          });
        }
        return data;
      }


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
        const table = parseHTMLTable(response2.data);
        console.log(table);
        setResult(response2.data);
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
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : <p>Loading data...</p>}

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
