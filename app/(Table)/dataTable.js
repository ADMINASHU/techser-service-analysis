import React from 'react';

const DataTable = ({ data }) => {
  // Select specific columns: 2, 3, and 4 (index 1, 2, 3)
  const selectedColumns = [1, 3, 4,5, 11];

  // Ensure data is available and has the correct format
  if (!data || !Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
    return <p>Loading data...</p>;
  }

  const formatData = (row) => {
    return selectedColumns.map((colIndex) => (
      <td key={colIndex}>{row[colIndex] !== undefined ? row[colIndex] : ""}</td>
    ));
  };

  return (
    <div>
      <h1>Formatted Data Table</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {selectedColumns.map((colIndex) => (
              <th key={colIndex}>{data[0][colIndex]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {formatData(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
