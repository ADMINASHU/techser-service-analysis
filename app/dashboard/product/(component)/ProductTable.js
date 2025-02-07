"use client";

import React from "react";

const ProductTable = ({ productData }) => {
  return (
    <div>
      <div>Product Page</div>
      <table>
        <thead>
          <tr>
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
          </tr>
        </thead>
        <tbody>
          {productData?.map((item, index) => (
            <tr key={index}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
