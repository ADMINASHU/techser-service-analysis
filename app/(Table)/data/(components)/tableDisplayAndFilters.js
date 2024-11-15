import React, { useState } from 'react';

const TableDisplayAndFilters = ({ processedData, filters, handleFilterChange }) => {
  const selectedColumns = [1,3]; // Columns to display
  const formatData = (row) => {
    return selectedColumns.map((colIndex) => (
      <td key={colIndex}>{row[colIndex] !== undefined ? row[colIndex] : ''}</td>
    )).concat(
      <td key="closed-date">{row[row.length - 12]}</td>, // Add the new "Closed Date" column
      <td key="duration">{row[row.length - 11]}</td>, // Add the new "Duration" column
      <td key="complaint-id">{row[row.length - 10]}</td>, // Add the new "Complaint ID" column
      <td key="original-complaint-id">{row[row.length - 9]}</td>, // Add the new "Original Complaint ID" column
      <td key="nature-of-complaint">{row[row.length - 8]}</td>, // Add the new "Nature of Complaint" column
      <td key="status">{row[row.length - 7]}</td>, // Add the new "Status" column
      <td key="new-status">{row[row.length - 6]}</td>, // Add the new "New Status" column
      <td key="assigned-to">{row[row.length - 5]}</td>, // Add the new "Assigned To" column
      <td key="region">{row[row.length - 4]}</td>, // Add the new "Region" column
      <td key="branch">{row[row.length - 3]}</td>, // Add the new "Branch" column
      <td key="month">{row[row.length - 2]}</td>, // Add the new "Month" column
      <td key="year">{row[row.length - 1]}</td> // Add the new "Year" column
    );
  };

  const filteredData = processedData.filter(row => {
    return (
      (filters.year === '' || row[row.length - 1] === filters.year) &&
      (filters.month === '' || row[row.length - 2] === filters.month) &&
      (filters.region === '' || row[row.length - 4] === filters.region) &&
      (filters.branch === '' || row[row.length - 3] === filters.branch) &&
      (filters.natureOfComplaint === '' || row[row.length - 8] === filters.natureOfComplaint) &&
      (filters.newStatus === '' || row[row.length - 6] === filters.newStatus) &&
      (filters.assignedTo === '' || row[row.length - 5] === filters.assignedTo)
    );
  });

  return (
    <div>
      <div className="filters">
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          <option value="">Select Year</option>
          {/* Add year options dynamically */}
          {Array.from(new Set(processedData.slice(1).map(row => row[row.length - 1]))).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select name="month" value={filters.month} onChange={handleFilterChange}>
          <option value="">Select Month</option>
          {/* Add month options dynamically */}
          {Array.from(new Set(processedData.slice(1).map(row => row[row.length - 2]))).map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="">Select Region</option>
          {/* Add region options dynamically */}
          {Array.from(new Set(processedData.slice(1).map(row => row[row.length - 4]))).map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
          <option value="">Select Branch</option>
          {/* Add branch options dynamically */}
          {Array.from(new Set(processedData.slice(1).map(row => row[row.length - 3]))).map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
        <select name="natureOfComplaint" value={filters.natureOfComplaint} onChange={handleFilterChange}>
          <option value="">Select Nature of Complaint</option>
          {/* Add nature of complaint options dynamically */}
          {Array.from(new Set(processedData.slice(1).map(row => row[row.length - 8]))).map(nature => (
            <option key={nature} value={nature}>{nature}</option>
          ))}
        </select>
        <select name="newStatus" value={filters.newStatus} onChange={handleFilterChange}>
          <option value="">Select New Status</option>
          {/* Add new status options dynamically */}
          {Array.from(new Set(processedData.slice(1).map(row => row[row.length - 6]))).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange}>
          <option value="">Select Assigned To</option>
          {/* Add assigned to options dynamically */}
          {Array.from(new Set(processedData.slice(1).map(row => row[row.length - 5]))).map(assigned => (
            <option key={assigned} value={assigned}>{assigned}</option>
          ))}
        </select>
      </div>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {selectedColumns.map((colIndex) => (
              <th key={colIndex}>{processedData[0][colIndex]}</th>
            ))}
            <th>Closed Date</th>
            <th>Duration</th>
            <th>Complaint ID</th>
            <th>Original Complaint ID</th>
            <th>Nature of Complaint</th>
            <th>Status</th>
            <th>New Status</th>
            <th>Assigned To</th>
            <th>Region</th>
            <th>Branch</th>
            <th>Month</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {formatData(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableDisplayAndFilters;
