"use client"
import { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [processedData, setProcessedData] = useState([]);

  return (
    <DataContext.Provider value={{ processedData, setProcessedData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
