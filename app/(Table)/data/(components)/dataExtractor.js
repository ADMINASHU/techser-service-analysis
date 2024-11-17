import React, { useState, useEffect } from "react";
import { parse, differenceInHours, format } from "date-fns";

const DataExtractor = ({ data, onDataProcessed }) => {
  console.log("page: " +  JSON.stringify(data));

  const regionList = [
    "AP & TELANGANA",
    "CHATTISGARH",
    "GOA",
    "KALKA",
    "KARNATAKA",
    "KERALA",
    "MADHYA PRADESH",
    "MUMBAI",
    "RAJASTHAN",
    "TAMIL NADU",
    "West Bengal",
  ];

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
      return;
    }

    // Process the data to add the new columns with extracted date, duration, complaint ID, original complaint ID, nature of complaint, status, assigned to, region, branch, month, and year
    const newData = data
      .map((row, index) => {
        if (index === 0) {
          // Header row
          return [
            ...row,
            "Closed Date",
            "Duration",
            "Complaint ID",
            "Original Complaint ID",
            "Nature of Complaint",
            "Status",
            "Assigned To",
            "Region",
            "Branch",
            "Month",
            "Year",
          ];
        } else {
          // Data rows
          const dateStr = row[4]; // Column 5 (index 4)
          const callDateStr = row[3]; // Column 4 (index 3)
          let lastDate = dateStr;
          let duration = "";
          let complaintID = "";
          let originalComplaintID = "";
          let status = "";
          let natureOfComplaint = "";
          let assignedTo = "";
          let region = "";
          let branch = "";
          let month = "";
          let year = "";

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
            parsedLastDate = parse(lastDate, "dd.MMM.yyyy HH:mm", new Date());
          }
          const parsedCallDate = parse(callDateStr, "dd.MMM.yyyy HH:mm", new Date());

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
          if (duration === "" || parseFloat(duration) < 0) {
            return null;
          }

          // Extract Complaint ID using regex
          const complaintIDMatch = row[1].match(/B\d{2}[A-Z]\d+-\d+(?:-\d+)?/);
          if (complaintIDMatch) {
            complaintID = complaintIDMatch[0];
          }

          // Extract Original Complaint ID
          if (complaintID.includes("-")) {
            originalComplaintID = complaintID.split("-").slice(0, 2).join("-");
          } else {
            originalComplaintID = complaintID;
          }

          // Extract Status using regex
          const statusMatch = row[1].match(/(COMPLETED|NEW|IN PROCESS)/);
          if (statusMatch) {
            status = statusMatch[0];
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
          const regionPattern = new RegExp(
            regionList.map((region) => region.toUpperCase()).join("|"),
            "g"
          );
          const regionMatch = row[11].toUpperCase().match(regionPattern);
          if (regionMatch) {
            region = regionMatch[0];
          }

          // Extract remaining text in column 12 after the region extraction
          const branchText = row[11].toUpperCase().replace(regionPattern, "").trim();
          if (!branchText) {
            branch = region;
          } else {
            branch = branchText;
          }
          // Extract Month and Year from Call Date
          if (parsedCallDate) {
            month = format(parsedCallDate, "MMM");
            year = format(parsedCallDate, "yyyy");
          }

          return [
            ...row,
            lastDate !== undefined ? lastDate : "",
            duration,
            complaintID,
            originalComplaintID,
            natureOfComplaint,
            status,
            assignedTo,
            region,
            branch,
            month,
            year,
          ];
        }
      })
      .filter((row) => row !== null); // Filter out rows with negative duration

    // Step 2: Count occurrences of each "Original Complaint ID"
    const countMap = new Map();
    newData.forEach((row, index) => {
      if (index > 0) {
        // Skip header row
        const originalComplaintID = row[17]; // Assuming "Original Complaint ID" is in column 17 (index 17)
        if (originalComplaintID) {
          if (countMap.has(originalComplaintID)) {
            countMap.set(originalComplaintID, countMap.get(originalComplaintID) + 1);
          } else {
            countMap.set(originalComplaintID, 1);
          }
        }
      }
    });
    // Step 3: Add the count in a new column
    const finalData = newData.map((row, index) => {
      if (index === 0) {
        // Header row
        return [...row, "Count"];
      } else {
        // Data rows
        const originalComplaintID = row[17];
        const count = countMap.get(originalComplaintID) || 0;
        return [...row, count];
      }
    });

    // Step 4: Add column "Real Status"
    const finalSData = finalData.map((row, index) => {
      if (index === 0) {
        // Header row
        return [...row, "Real Status"];
      } else {
        const complaintID = row[16];
        const status = row[19];
        const count = row[25] -1;
        // const lastSegment = complaintID.split("-").slice(-1)[1];
        const regex = new RegExp("B\\d{2}[A-Z]\\d+-\\d+-(\\d+)?");
        const match = regex.exec(complaintID);
        // const lastSegmentNumber = parseInt(match[1]) || 0;
        let realStatus = "";
        const lastSegmentNumber = match ? match[1] : 0;

        if (lastSegmentNumber < (count) && status === "COMPLETED") {
          realStatus = "IN PROGRESS";
        } else {
          realStatus = status;
        }
        return [...row, realStatus];
      }
    });

    // Step 5: Add column "Is Pending"
    const finalPendingData = finalSData.map((row, index) => {
      if (index === 0) {
        // Header row
        return [...row, "Is Pending"];
      } else {
        const complaintID = row[16];
        const regex = new RegExp("B\\d{2}[A-Z]\\d+-\\d+-(\\d+)?");
        const match = regex.exec(complaintID);
        const value = match ? parseInt(match[1]) > 0 : false;
        const isPending = value ? "TRUE" : "";
        return [...row, isPending];
      }
    });
    // console.log(finalPendingData);
    onDataProcessed(finalPendingData);
  }, [data, onDataProcessed]);

  return null;
};

export default DataExtractor;
