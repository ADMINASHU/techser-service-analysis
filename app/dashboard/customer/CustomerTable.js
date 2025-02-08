"use client";

import React, { useContext } from "react";
import ProductContext from "@/context/ProductContext";
import styles from "../../Dashboard.module.css";
import { utils, writeFile } from "xlsx";
const CustomerTable = () => {
  const { customerData } = useContext(ProductContext);

  return (
    <div>
      <div>Customer Page</div>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Customer Address</th>
            <th>Region</th>
            <th>Branch</th>
            <th>Breakdown</th>
            <th>Installation</th>
            <th>PM</th>
          </tr>
        </thead>
        <tbody>
          {customerData.map((item, index) => (
            <tr key={index}>
              <td>{item.custId}</td>
              <td>{item.customerName}</td>
              <td>{item.customerAddress}</td>
              <td>{item.region}</td>
              <td>{item.branch}</td>
              <td>{item.breakdown}</td>
              <td>{item.installation}</td>
              <td>{item.pm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
