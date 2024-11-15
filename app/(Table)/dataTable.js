import React, { useState, useEffect } from 'react';
import { parse, differenceInHours } from 'date-fns';

const DataTable = ({ data }) => {
  const [processedData, setProcessedData] = useState([]);
  const selectedColumns = [3]; // Columns to display

  const regionList = [
    'AP & TELANGANA',
    'CHATTISGARH',
    'GOA',
    'KALKA',
    'KARNATAKA',
    'KERALA',
    'MADHYA PRADESH',
    'MUMBAI',
    'RAJASTHAN',
    'TAMIL NADU',
    'West Bengal'
  ];

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
      return;
    }

    // Process the data to add the new columns with extracted date, duration, complaint ID, nature of complaint, status, assigned to, region, branch, and new status
    const newData = data.map((row, index) => {
      if (index === 0) {
        // Header row
        return [
          ...row,
          'Closed Date',
          'Duration',
          'Complaint ID',
          'Original Complaint ID',
          'Nature of Complaint',
          'Status',
          'New Status',
          'Assigned To',
          'Region',
          'Branch'
        ];
      } else {
        // Data rows
        const dateStr = row[4]; // Column 5 (index 4)
        const callDateStr = row[3]; // Column 4 (index 3)
        let lastDate = dateStr;
        let duration = '';
        let complaintID = '';
        let originalComplaintID = '';
        let status = '';
        let newStatus = '';
        let natureOfComplaint = '';
        let assignedTo = '';
        let region = '';
        let branch = '';

        // Extract the last date
        if (dateStr) {
          const dates = dateStr.match(/\d{2}\.\w{3}\.\d{4} \d{2}:\d{2}/g);
          if (dates && dates.length > 1) {
            lastDate = dates[dates.length - 1];
          }
        }

        // Convert dates to Date objects and calculate duration using date-fns
        const currentTime = new Date();
        let parsedLastDate = null;
        if (lastDate) {
          parsedLastDate = parse(lastDate, 'dd.MMM.yyyy HH:mm', new Date());
        }
        const parsedCallDate = parse(callDateStr, 'dd.MMM.yyyy HH:mm', new Date());

        if (!parsedLastDate) {
          parsedLastDate = currentTime;
        }

        if (!isNaN(parsedLastDate.getTime()) && !isNaN(parsedCallDate.getTime())) {
          const diffInHours = differenceInHours(parsedLastDate, parsedCallDate);
          const diffInDays = (diffInHours / 24).toFixed(2); // Convert hours to days with decimal values
          if (diffInDays >= 0) {
            duration = `${diffInDays} days`;
          }
        }

        // Skip rows with negative duration
        if (duration === '' || parseFloat(duration) < 0) {
          return null;
        }

        // Extract Complaint ID using regex
        const complaintIDMatch = row[1].match(/B\d{2}[A-Z]\d+-\d+(?:-\d+)?/);
        if (complaintIDMatch) {
          complaintID = complaintIDMatch[0];
        }

        // Extract Original Complaint ID 
        if (complaintID.includes('-')) { 
          originalComplaintID = complaintID.split('-').slice(0, 2).join('-'); 
        } else {
          originalComplaintID = complaintID; 
        }

        // Extract Status using regex
        const statusMatch = row[1].match(/(COMPLETED|NEW|IN PROCESS)/);
        if (statusMatch) {
          status = statusMatch[0];
        }

        // Determine New Status
        const count = data.filter(d => d[1].startsWith(originalComplaintID)).length - 1;
        const lastSegment = complaintID.split('-').slice(-1)[0];
        const lastSegmentNumber = parseInt(lastSegment) || 0;
        
        if (lastSegmentNumber === count) {
          newStatus = status;
        } else if (status === "COMPLETED") {
          newStatus = "IN PROCESS";
        } else {
          newStatus = status;
        }

        // Extract Nature of Complaint using regex
        const natureOfComplaintMatch = row[1].match(/(BREAKDOWN|INSTALLATION|PM)/);
        if (natureOfComplaintMatch) {
          natureOfComplaint = natureOfComplaintMatch[0];
        }

        // Extract Assigned To using regex logic from column 6 (index 5)
        const assignedToMatch = row[5].match(/^[A-Za-z]+(?: [A-Za-z]+)?/);
        if (assignedToMatch && assignedToMatch[0] !== "NOT ALLOCATED") {
          assignedTo = assignedToMatch[0];
        }

        // Extract Region using regex logic from column 12 (index 11)
        const regionPattern = new RegExp(regionList.map(region => region.toUpperCase()).join('|'), 'g');
        const regionMatch = row[11].toUpperCase().match(regionPattern);
        if (regionMatch) {
          region = regionMatch[0];
        }

        // Extract remaining text in column 12 after the region extraction
        const branchText = row[11].toUpperCase().replace(regionPattern, '').trim();
        branch = branchText;

        return [
          ...row,
          lastDate !== undefined ? lastDate : '',
          duration,
          complaintID,
          originalComplaintID,
          natureOfComplaint,
          status,
          newStatus,
          assignedTo,
          region,
          branch
        ];
      }
    }).filter(row => row !== null); // Filter out rows with negative duration
    setProcessedData(newData);
  }, [data]);

  if (!processedData || !Array.isArray(processedData) || processedData.length === 0) {
    return <p>Loading data...</p>;
  }

  const formatData = (row) => {
    return selectedColumns.map((colIndex) => (
      <td key={colIndex}>{row[colIndex] !== undefined ? row[colIndex] : ''}</td>
    )).concat(
      <td key="closed-date">{row[row.length - 10]}</td>, // Add the new "Closed Date" column
      <td key="duration">{row[row.length - 9]}</td>, // Add the new "Duration" column
      <td key="complaint-id">{row[row.length - 8]}</td>, // Add the new "Complaint ID" column
      <td key="original-complaint-id">{row[row.length - 7]}</td>, // Add the new "Original Complaint ID" column
      <td key="nature-of-complaint">{row[row.length - 6]}</td>, // Add the new "Nature of Complaint" column
      <td key="status">{row[row.length - 5]}</td>, // Add the new "Status" column
      <td key="new-status">{row[row.length - 4]}</td>, // Add the new "New Status" column
      <td key="assigned-to">{row[row.length - 3]}</td>, // Add the new "Assigned To" column
      <td key="region">{row[row.length - 2]}</td>, // Add the new "Region" column
      <td key="branch">{row[row.length - 1]}</td> // Add the new "Branch" column
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
