"use client";

import React, { useContext, useEffect, useState } from "react";
import TableView from "./(components)/TableView";
import DataContext from "../../../context/DataContext";

const DataPage = () => {
  const { processedData } = useContext(DataContext);

  return (
    <div>
      <h1>Complaint Data</h1>
      <TableView data={processedData} />
    </div>
  );
};

export default DataPage;
