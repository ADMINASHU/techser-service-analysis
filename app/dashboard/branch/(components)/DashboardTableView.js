import React from 'react';

const DashboardTableView = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <table>
      <thead>
        <tr>
          {Object.values(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((value, colIndex) => (
              <td key={colIndex}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DashboardTableView;
