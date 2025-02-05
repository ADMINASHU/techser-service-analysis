"use client";

import React, { useContext } from "react";
import ProductContext from "../../context/ProductContext";

const SystemPage = () => {
  const { productData } = useContext(ProductContext);

  return (
    <div>
      <div>SystemPage</div>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Customer Address</th>
            <th>Region</th>
            <th>Branch</th>
            <th>Serial No</th>
            <th>Product ID</th>
            <th>Product Description</th>
            <th>Name</th>
            <th>Category</th>
            <th>Series</th>
            <th>Model</th>
            <th>Capacity</th>
            <th>Capacity Unit</th>
            <th>Breakdown</th>
            <th>Installation</th>
            <th>PM</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((item, index) => (
            <tr key={index}>
              <td>{item.custId}</td>
              <td>{item.customerName}</td>
              <td>{item.customerAddress}</td>
              <td>{item.region}</td>
              <td>{item.branch}</td>
              <td>{item.serialNo}</td>
              <td>{item.prodId}</td>
              <td>{item.prodDescription}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.series}</td>
              <td>{item.model}</td>
              <td>{item.capacity}</td>
              <td>{item.capacityUnit}</td>
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

export default SystemPage;
