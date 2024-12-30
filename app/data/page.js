"use client";

import React, { useContext } from "react";
import TableView from "./(components)/TableView";
import DataContext from "../../context/DataContext";

const DataPage = () => {
  const { processedData } = useContext(DataContext);

  return (
    <div style={{ margin: "10px" }}>
      {/* <h1>Complaint Data</h1> */}
      <TableView data={processedData} />
    </div>
  );
};

export default DataPage;
