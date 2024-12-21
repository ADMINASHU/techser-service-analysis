// import React, { useState, useEffect } from "react";
// import { parse, differenceInHours, format } from "date-fns";

// const DataExtractor = ({ data, onDataProcessed, points }) => {
//   // console.log("Extractor Page: " + JSON.stringify(points));

//   useEffect(() => {
//     if (!data) {
//       // console.log("no data coming");
//       return;
//     }
//     const regionList = [
//       "AP & TELANGANA",
//       "CHATTISGARH",
//       "GOA",
//       "KALKA",
//       "KARNATAKA",
//       "KERALA",
//       "MADHYA PRADESH",
//       "MUMBAI",
//       "RAJASTHAN",
//       "TAMIL NADU",
//       "West Bengal",
//     ];
//     // Process the data to add the new columns with extracted date, duration, complaint ID, original complaint ID, nature of complaint, status, assigned to, region, branch, month, and year
//     const newData = data
//       .map((item, index) => {
//         if (index === 0) {
//           // Header row
//           return {
//             ...item,
//             closedDate: "Closed Date",
//             duration: "Duration",
//             complaintID: "Complaint ID",
//             origComplaintID: "Original Complaint ID",
//             natureOfComplaint: "Nature of Complaint",
//             status: "Status",
//             assignedTo: "Assigned To",
//             region: "Region",
//             branch: "Branch",
//             month: "Month",
//             year: "Year",
//           };
//         } else {
//           // Data rows
//           const dateStr = item["callStartEndDate"]; // Column 5 (index 4)
//           const callDate = item["callDate"]; // Column 4 (index 3)
//           let lastDate = dateStr;
//           let duration = "";
//           let complaintID = "";
//           let originalComplaintID = "";
//           let status = "";
//           let natureOfComplaint = "";
//           let assignedTo = "";
//           let region = "";
//           let branch = "";
//           let month = "";
//           let year = "";

//           // Extract the last date
//           if (dateStr) {
//             const dates = dateStr.match(/\d{2}\.\w{3}\.\d{4} \d{2}:\d{2}/g);
//             if (dates && dates.length > 1) {
//               lastDate = dates[dates.length - 1];
//             }
//           }

//           // Convert dates to Date objects and calculate duration using date-fns
//           const currentTime = new Date();
//           let parsedLastDate = null;
//           if (lastDate) {
//             parsedLastDate = parse(lastDate, "dd.MMM.yyyy HH:mm", new Date());
//           }
//           const parsedCallDate = parse(callDate, "dd.MMM.yyyy HH:mm", new Date());

//           if (!parsedLastDate) {
//             parsedLastDate = currentTime;
//           }

//           if (!isNaN(parsedLastDate.getTime()) && !isNaN(parsedCallDate.getTime())) {
//             const diffInHours = differenceInHours(parsedLastDate, parsedCallDate);
//             const diffInDays = (diffInHours / 24).toFixed(2); // Convert hours to days with decimal values
//             if (diffInDays >= 0) {
//               duration = `${diffInDays} days`;
//             }
//           }

//           // Skip rows with negative duration
//           if (duration === "" || parseFloat(duration) < 0) {
//             return null;
//           }

//           // Extract Complaint ID using regex
//           const complaintIDMatch = item["callNo"].match(/B\d{2}[A-Z]\d+-\d+(?:-\d+)?/);
//           if (complaintIDMatch) {
//             complaintID = complaintIDMatch[0];
//           }

//           // Extract Original Complaint ID
//           if (complaintID.includes("-")) {
//             originalComplaintID = complaintID.split("-").slice(0, 2).join("-");
//           } else {
//             originalComplaintID = complaintID;
//           }

//           // Extract Status using regex
//           const statusMatch = item["callNo"].match(/(COMPLETED|NEW|IN PROCESS)/);
//           if (statusMatch) {
//             status = statusMatch[0];
//           }

//           // Extract Nature of Complaint using regex
//           const natureOfComplaintMatch = item["callNo"].match(/(BREAKDOWN|INSTALLATION|PM)/);
//           if (natureOfComplaintMatch) {
//             natureOfComplaint = natureOfComplaintMatch[0];
//           }

//           // Extract Assigned To using regex logic from column 6 (index 5)
//           const assignedToMatch = item["engineerName"].match(/^[A-Za-z]+(?: [A-Za-z]+)?/);
//           if (assignedToMatch && assignedToMatch[0] !== "NOT ALLOCATED") {
//             assignedTo = assignedToMatch[0];
//           }

//           // Extract Region using regex logic from column 12 (index 11)
//           const regionPattern = new RegExp(
//             regionList.map((region) => region.toUpperCase()).join("|"),
//             "g"
//           );
//           const regionMatch = item["regionBranch"].toUpperCase().match(regionPattern);
//           if (regionMatch) {
//             region = regionMatch[0];
//           }

//           // Extract remaining text in column 12 after the region extraction
//           const branchText = item["regionBranch"].toUpperCase().replace(regionPattern, "").trim();
//           if (!branchText) {
//             branch = region;
//           } else {
//             branch = branchText;
//           }
//           // Extract Month and Year from Call Date
//           if (parsedCallDate) {
//             month = format(parsedCallDate, "MMM");
//             year = format(parsedCallDate, "yyyy");
//           }

//           return {
//             ...item,
//             closedDate: lastDate !== undefined ? lastDate : "",
//             duration: duration,
//             complaintID: complaintID,
//             origComplaintID: originalComplaintID,
//             natureOfComplaint: natureOfComplaint,
//             status: status,
//             assignedTo: assignedTo,
//             region: region,
//             branch: branch,
//             month: month,
//             year: year,
//           };
//         }
//       })
//       .filter((row) => row !== null); // Filter out rows with negative duration

//     // Step 2: Count occurrences of each "Original Complaint ID"
//     const countMap = new Map();
//     newData.forEach((item, index) => {
//       if (index > 0) {
//         // Skip header row
//         const originalComplaintID = item["origComplaintID"]; // Assuming "Original Complaint ID" is in column 17 (index 17)
//         if (originalComplaintID) {
//           if (countMap.has(originalComplaintID)) {
//             countMap.set(originalComplaintID, countMap.get(originalComplaintID) + 1);
//           } else {
//             countMap.set(originalComplaintID, 1);
//           }
//         }
//       }
//     });
//     // Step 3: Add the count in a new column
//     const finalData = newData.map((item, index) => {
//       if (index === 0) {
//         // Header row
//         return { ...item, count: "Count" };
//       } else {
//         // Data rows
//         const originalComplaintID = item["origComplaintID"];
//         const count = countMap.get(originalComplaintID) || 0;
//         return { ...item, count: count };
//       }
//     });

//     // Step 4: Add column "Real Status"
//     const finalSData = finalData.map((item, index) => {
//       if (index === 0) {
//         // Header row
//         return { ...item, realStatus: "Real Status" };
//       } else {
//         const complaintID = item["complaintID"];
//         const status = item["status"];
//         const count = item["count"] - 1;
//         // const lastSegment = complaintID.split("-").slice(-1)[1];
//         const regex = new RegExp("B\\d{2}[A-Z]\\d+-\\d+-(\\d+)?");
//         const match = regex.exec(complaintID);
//         // const lastSegmentNumber = parseInt(match[1]) || 0;
//         let realStatus = "";
//         const lastSegmentNumber = match ? match[1] : 0;

//         if (lastSegmentNumber < count && status === "COMPLETED") {
//           realStatus = "IN PROCESS";
//         } else {
//           realStatus = status;
//         }
//         return { ...item, realStatus: realStatus };
//       }
//     });

//     // Step 5: Add column "Is Pending"
//     const finalPendingData = finalSData.map((item, index) => {
//       if (index === 0) {
//         // Header row
//         return { ...item, isPending: "Is Pending" };
//       } else {
//         const complaintID = item["complaintID"];
//         const regex = new RegExp("B\\d{2}[A-Z]\\d+-\\d+-(\\d+)?");
//         const match = regex.exec(complaintID);
//         const value = match ? parseInt(match[1]) > 0 : false;
//         const isPending = value ? "TRUE" : "";
//         return { ...item, isPending: isPending };
//       }
//     });
//     // Step 5: Add column "C Point"
//     const finalPointData = finalPendingData.map((item, index) => {
//       if (index === 0) {
//         // Header row
//         return {
//           ...item,
//           cPoint: "C Point",
//           ePoint: "E Point",
//           bPoint: "B Point",
//           rPoint: "R Point",
//         };
//       } else {
//         const isPending = item["isPending"];
//         const complaintID = item["complaintID"];
//         const regex = new RegExp("B\\d{2}[A-Z]\\d+-\\d+-(\\d+)?");
//         const match = regex.exec(complaintID);
//         const count = match ? parseInt(match[1]) : 0;
//         const natureOfComplaint = item["natureOfComplaint"];
//         const realStatus = item["realStatus"];
//         const duration = parseFloat(item["duration"]);
//         const cPoint = (() => {
//           if (isPending) {
//             if (count > 2) {
//               return points[natureOfComplaint].eng.closed[2];
//             } else {
//               return points[natureOfComplaint].eng.closed[1];
//             }
//           } else {
//             return points[natureOfComplaint].eng.closed[0];
//           }
//         })();

//         const ePoint = (() => {
//           if (realStatus === "NEW") {
//             return points[natureOfComplaint].eng.new;
//           } else if (realStatus === "IN PROCESS") {
//             return points[natureOfComplaint].eng.pending;
//           } else if (realStatus === "COMPLETED") {
//             return cPoint;
//           }
//         })();

//         const bPoint = (() => {
//           const freeDay = 3;
//           if (realStatus === "NEW" && duration > freeDay) {
//             return (duration - freeDay) * points[natureOfComplaint].branch.new;
//           } else if (realStatus === "IN PROCESS" && duration > freeDay) {
//             return (duration - freeDay) * points[natureOfComplaint].branch.pending;
//           } else if (realStatus === "COMPLETED" && duration > freeDay) {
//             return (duration - freeDay) * points[natureOfComplaint].branch.closed;
//           } else {
//             return 0;
//           }
//         })();

//         const rPoint = (() => {
//           if (realStatus === "NEW") {
//             return points[natureOfComplaint].region.new;
//           } else if (realStatus === "IN PROCESS") {
//             return points[natureOfComplaint].region.pending;
//           } else if (realStatus === "COMPLETED") {
//             return points[natureOfComplaint].region.closed;
//           } else {
//             return 0;
//           }
//         })();

//         return {
//           ...item,
//           cPoint: cPoint,
//           ePoint: ePoint,
//           bPoint: bPoint === 0 ? bPoint : bPoint.toFixed(2),
//           rPoint: rPoint,
//         };
//       }
//     });
//     // console.log("extracted: " + finalPendingData);
//     onDataProcessed(finalPointData);
//   }, [data, onDataProcessed, points]);

//   return null;
// };

// export default DataExtractor;
