import React, { useState, useEffect } from 'react';
import { parse, differenceInHours } from 'date-fns';

const DataTable = ({ data }) => {
  const [processedData, setProcessedData] = useState([]);
  const selectedColumns = [1, 3, 4, 5, 11]; // Columns to display

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
      return;
    }

    // Process the data to add the new columns with extracted date and duration
    const newData = data.map((row, index) => {
      if (index === 0) {
        // Header row
        return [...row, 'Extracted Date', 'Duration'];
      } else {
        // Data rows
        const dateStr = row[4]; // Column 5 (index 4)
        const callDateStr = row[3]; // Column 4 (index 3)
        let lastDate = dateStr;
        let duration = '';

        // Extract the last date
        if (dateStr) {
          const dates = dateStr.match(/\d{2}\.\w{3}\.\d{4} \d{2}:\d{2}/g);
          if (dates && dates.length > 1) {
            lastDate = dates[dates.length - 1];
          }
        }

        // Convert dates to Date objects and calculate duration using date-fns
        if (lastDate && callDateStr) {
          const parsedLastDate = parse(lastDate, 'dd.MMM.yyyy HH:mm', new Date());
          const parsedCallDate = parse(callDateStr, 'dd.MMM.yyyy HH:mm', new Date());

          if (!isNaN(parsedLastDate.getTime()) && !isNaN(parsedCallDate.getTime())) {
            const diffInHours = differenceInHours(parsedLastDate, parsedCallDate);
            const diffInDays = (diffInHours / 24).toFixed(2); // Convert hours to days with decimal values
            duration = `${diffInDays} days`;
          }
        }

        return [...row, lastDate !== undefined ? lastDate : '', duration];
      }
    });
    setProcessedData(newData);
  }, [data]);

  if (!processedData || !Array.isArray(processedData) || processedData.length === 0) {
    return <p>Loading data...</p>;
  }

  const formatData = (row) => {
    return selectedColumns.map((colIndex) => (
      <td key={colIndex}>{row[colIndex] !== undefined ? row[colIndex] : ''}</td>
    )).concat(
      <td key="extracted-date">{row[row.length - 2]}</td>, // Add the new "Extracted Date" column
      <td key="duration">{row[row.length - 1]}</td> // Add the new "Duration" column
    );
  };

  return (
    <div>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {selectedColumns.map((colIndex) => (
              <th key={colIndex}>{processedData[0][colIndex]}</th>
            ))}
            <th>Extracted Date</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {processedData.slice(1).map((row, rowIndex) => (
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
