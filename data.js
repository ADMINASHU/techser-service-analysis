// const rowData = {
//   callNo: "Call NoNature of Complaint",
//   blank: "",
//   callDate: "Call Date",
//   callStartEndDate: "Call Start Date  Call End Date",
//   cityState: "CityState",
//   contactPerson: "Contact PersonContact Person PhoneContact Person Designation",
//   customerName: "Customer NameCustomer Address",
//   engineerName: "Engineer Name  Engineer Contact",
//   faultReport: "Fault Report",
//   phoneEmail: "PhoneEmail",
//   regionBranch: "RegionBranch",
//   serialNo: "Serial NoProduct CategoryProduct SeriesProduct NameProduct Model",
//   servicePersonRemarks: "Service Person Remarks",
//   unitStatus: "Unit StatusStart DateEnd Date",
// };
// import React, { useState, useEffect } from "react";
// import styles from "./page.module.css";

// const TableView = ({ data, selectedColumns }) => {
//   const [filters, setFilters] = useState({
//     year: "",
//     month: "",
//     region: "ALL Region",
//     branch: "",
//     natureOfComplaint: "",
//     realStatus: "",
//     assignedTo: "",
//   });

//   useEffect(() => {
//     if (data.length > 0) {
//       const latestRow = data[data.length - 1];
//       setFilters((prevFilters) => ({
//         ...prevFilters,
//         year: latestRow.year || "",
//         month: latestRow.month || "",
//       }));
//     }
//   }, [data]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
//   };

//   useEffect(() => {
//     if (!filters.region || filters.region === "ALL Region") {
//       setFilters((prevFilters) => ({ ...prevFilters, branch: "", assignedTo: "" }));
//     } else if (!filters.branch) {
//       setFilters((prevFilters) => ({ ...prevFilters, assignedTo: "" }));
//     }
//   }, [filters.region, filters.branch]);

//   const filteredData = data.filter((row) => {
//     return (
//       (!filters.year || row.year === filters.year) &&
//       (!filters.month || row.month === filters.month) &&
//       (filters.region === "ALL Region" || !filters.region || row.region === filters.region) &&
//       (!filters.branch || row.branch === filters.branch) &&
//       (!filters.natureOfComplaint || row.natureOfComplaint === filters.natureOfComplaint) &&
//       (!filters.realStatus || row.realStatus === filters.realStatus) &&
//       (!filters.assignedTo || row.assignedTo === filters.assignedTo)
//     );
//   });

//   const filteredBranches =
//     !filters.region || filters.region === "ALL Region"
//       ? Array.from(new Set(data.map((row) => row.branch)))
//       : Array.from(new Set(data.filter((row) => row.region === filters.region).map((row) => row.branch)));

//   const filteredAssignedTo =
//     !filters.branch
//       ? Array.from(new Set(data.map((row) => row.assignedTo)))
//       : Array.from(new Set(data.filter((row) => row.branch === filters.branch).map((row) => row.assignedTo)));

//   return (
//     <div className={styles.page}>
//       <div className={styles.filterContainer}>
//         <select name="year" value={filters.year} onChange={handleFilterChange}>
//           <option value="">Select Year</option>
//           {Array.from(new Set(data.map((row) => row.year))).map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>
//         <select name="month" value={filters.month} onChange={handleFilterChange}>
//           <option value="">Select Month</option>
//           {Array.from(new Set(data.map((row) => row.month))).map((month) => (
//             <option key={month} value={month}>
//               {month}
//             </option>
//           ))}
//         </select>
//         <select name="region" value={filters.region} onChange={handleFilterChange}>
//           <option value="ALL Region">ALL Region</option>
//           {Array.from(new Set(data.map((row) => row.region))).map((region) => (
//             <option key={region} value={region}>
//               {region}
//             </option>
//           ))}
//         </select>
//         <select name="branch" value={filters.branch} onChange={handleFilterChange}>
//           <option value="">Select Branch</option>
//           {filteredBranches.map((branch) => (
//             <option key={branch} value={branch}>
//               {branch}
//             </option>
//           ))}
//         </select>
//         <select name="natureOfComplaint" value={filters.natureOfComplaint} onChange={handleFilterChange}>
//           <option value="">Select Nature of Complaint</option>
//           {Array.from(new Set(data.map((row) => row.natureOfComplaint))).map((nature) => (
//             <option key={nature} value={nature}>
//               {nature}
//             </option>
//           ))}
//         </select>
//         <select name="realStatus" value={filters.realStatus} onChange={handleFilterChange}>
//           <option value="">Select Real Status</option>
//           {Array.from(new Set(data.map((row) => row.realStatus))).map((status) => (
//             <option key={status} value={status}>
//               {status}
//             </option>
//           ))}
//         </select>
//         <select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange}>
//           <option value="">Select Assigned To</option>
//           {filteredAssignedTo.map((assigned) => (
//             <option key={assigned} value={assigned}>
//               {assigned}
//             </option>
//           ))}
//         </select>
//       </div>
//       <table border="1" cellPadding="5">
//         <thead>
//           <tr>
//             {selectedColumns.map((col) => (
//               <th key={col}>{col}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {selectedColumns.map((col) => (
//                 <td key={col}>{row[col] !== undefined ? row[col] : ""}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TableView;
