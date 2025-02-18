"use client";

import React, { useContext, useState, useEffect, useMemo } from "react";
import ProductContext from "@/context/CustomerContext";
import styles from "../../Dashboard.module.css";
import { utils, writeFile } from "xlsx";
import { regionList } from "@/lib/regions";
const ProductTable = () => {
  const { filters, setFilters, productData } = useContext(ProductContext);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const getBranchesForRegion = (region) => {
    const branches = new Set();
    productData.forEach((row) => {
      if ((region === "" || row.region === region) && row.branch !== "Branch") {
        branches.add(row.branch);
      }
    });
    return Array.from(branches);
  };
  const handleResetFilters = () => {
    setFilters({
      region: "",
      branch: "",
      name: "",
      category: "",
      series: "",
      model: "",
      capacity: "",
    });
  };

  useEffect(() => {
    if (!filters.region || filters.region === "") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        branch: "",
        name: "",
        category: "",
        series: "",
        model: "",
        capacity: "",
      }));
    }
  }, [filters.region]);

  const handleExportToExcel = () => {
    const exportData = productData.map(({ serialNo, ...rest }) => rest);
    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Product Data");
    writeFile(workbook, "ProductData.xlsx");
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProductData = useMemo(() => {
    if (sortConfig.key) {
      return [...productData].sort((a, b) => {
        const aValue = isNaN(a[sortConfig.key]) ? a[sortConfig.key] : parseFloat(a[sortConfig.key]);
        const bValue = isNaN(b[sortConfig.key]) ? b[sortConfig.key] : parseFloat(b[sortConfig.key]);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return productData;
  }, [productData, sortConfig]);

  const getUniqueValues = (key) => {
    return [...new Set(productData.map((item) => item[key]))];
  };

  const getUniqueCapacities = () => {
    const capacities = productData.map((item) => ({
      capacity: item.capacity,
      capacityUnit: item.capacityUnit,
    }));
    const uniqueCapacities = capacities.reduce((acc, current) => {
      const x = acc.find(
        (item) => item.capacity === current.capacity && item.capacityUnit === current.capacityUnit
      );
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return uniqueCapacities;
  };

  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="">ALL Region</option>
          {regionList.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
          <option value="">ALL Branch</option>
          {getBranchesForRegion(filters.region).map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        <select name="name" value={filters.name} onChange={handleFilterChange}>
          <option value="">All Products</option>
          {getUniqueValues("name").map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {getUniqueValues("category").map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select name="series" value={filters.series} onChange={handleFilterChange}>
          <option value="">All Series</option>
          {getUniqueValues("series").map((series, index) => (
            <option key={index} value={series}>
              {series}
            </option>
          ))}
        </select>
        <select name="model" value={filters.model} onChange={handleFilterChange}>
          <option value="">All Models</option>
          {getUniqueValues("model").map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
        <select name="capacity" value={filters.capacity} onChange={handleFilterChange}>
          <option value="">All Capacities</option>
          {getUniqueCapacities().map((item, index) => (
            <option key={index} value={item.capacity}>
              {`${item.capacity} ${item.capacityUnit}`}
            </option>
          ))}
        </select>
        <button className={styles.ResetButton} onClick={handleResetFilters}>
          Reset Filters
        </button>
        <button className={styles.button} onClick={handleExportToExcel}>
          Export
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th className={styles.tableHeader}>S No</th>
              <th className={styles.tableHeader} onClick={() => handleSort("prodId")}>
                Product ID{" "}
                {sortConfig.key === "prodId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("prodDescription")}>
                Product Description{" "}
                {sortConfig.key === "prodDescription"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("category")}>
                Category{" "}
                {sortConfig.key === "category" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("series")}>
                Series{" "}
                {sortConfig.key === "series" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("model")}>
                Model{" "}
                {sortConfig.key === "model" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("name")}>
                Product{" "}
                {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("capacity")}>
                Capacity{" "}
                {sortConfig.key === "capacity" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("breakdown")}>
                Breakdown{" "}
                {sortConfig.key === "breakdown" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProductData?.map((item, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{index + 1}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.prodId}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.prodDescription}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.category}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.series}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.model}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.name}</div>
                </td>
                <td className={styles.tableCell}>
                  <div
                    className={styles.tableCellContent}
                  >{`${item.capacity} ${item.capacityUnit}`}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.breakdown}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
