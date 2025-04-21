"use client";

import { useState, useEffect, useContext } from "react";
import DashboardTableView from "./DashboardTableView";
import DataContext from "@/context/DataContext";

const DataCompile = () => {
  const { processedData, filterYear } = useContext(DataContext);
  const [data, setData] = useState({});
  const currentYear = new Date().getFullYear().toString();

  useEffect(() => {
    if (processedData.length > 0) {
      const processData = async () => {
        const yearToUse = filterYear || currentYear;
        const filterProcessData = processedData.filter(
          (item) => item.year === yearToUse
        );

        const uniqueEngineersPerBranch = filterProcessData.reduce((acc, item) => {
          if (item.assignedTo && item.account.erBranch) {
            if (!acc[item.account.erBranch]) {
              acc[item.account.erBranch] = new Set();
            }
            acc[item.account.erBranch].add(item.assignedTo);
          }
          return acc;
        }, {});

        const uniqueBranch = [
          ...new Set(filterProcessData.map((item) => item.branch).filter(Boolean)),
        ].sort();

        // Count occurrences of each engineer in processedData based on conditions
        const branchCallCount = filterProcessData.reduce((acc, item) => {
          if (item.branch) {
            acc[item.branch] = (acc[item.branch] || 0) + 1;

            if (!item.closedDate && item.realStatus != "NEW") {
              acc[`${item.branch}_openCall`] = (acc[`${item.branch}_openCall`] || 0) + 1;
            }

            if (item.realStatus === "NEW") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.branch}_newBreakdown`] = (acc[`${item.branch}_newBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.branch}_newInstallation`] =
                  (acc[`${item.branch}_newInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.branch}_newPM`] = (acc[`${item.branch}_newPM`] || 0) + 1;
              }
            } else if (item.realStatus === "IN PROCESS") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.branch}_pendBreakdown`] =
                  (acc[`${item.branch}_pendBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.branch}_pendInstallation`] =
                  (acc[`${item.branch}_pendInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.branch}_pendPM`] = (acc[`${item.branch}_pendPM`] || 0) + 1;
              }
            } else if (item.realStatus === "COMPLETED" && item.isPending === "") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.branch}_closeBreakdown`] =
                  (acc[`${item.branch}_closeBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.branch}_closeInstallation`] =
                  (acc[`${item.branch}_closeInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.branch}_closePM`] = (acc[`${item.branch}_closePM`] || 0) + 1;
              }
            } else if (item.realStatus === "COMPLETED" && item.isPending === "TRUE") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.branch}_pCloseBreakdown`] =
                  (acc[`${item.branch}_pCloseBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.branch}_pCloseInstallation`] =
                  (acc[`${item.branch}_pCloseInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.branch}_pClosePM`] = (acc[`${item.branch}_pClosePM`] || 0) + 1;
              }
            }
            // Sum ePoint, bPoint, and rPoint for each engineer, handle negative values correctly
            acc[`${item.branch}_ePoint`] =
              (acc[`${item.branch}_ePoint`] || 0) + (parseFloat(item.ePoint) || 0);
            acc[`${item.branch}_bPoint`] =
              (acc[`${item.branch}_bPoint`] || 0) + (parseFloat(item.bPoint) || 0);
            acc[`${item.branch}_rPoint`] =
              (acc[`${item.branch}_rPoint`] || 0) + (parseFloat(item.rPoint) || 0);
          }
          return acc;
        }, {});
        // Map unique engineers to regions and branches

        // Map unique engineers to regions and branches
        let totalVisitsSum = 0;
        const finalData = uniqueBranch.map((branch) => {
          // console.log(uniqueEngineersPerBranch[branch]);

          const branchData = filterProcessData.find((item) => item.branch === branch);
          const totalAssigned = branchCallCount[branch];
          const newBreakdown = branchCallCount[`${branch}_newBreakdown`] || 0;
          const newInstallation = branchCallCount[`${branch}_newInstallation`] || 0;
          const newPM = branchCallCount[`${branch}_newPM`] || 0;
          const openCall = branchCallCount[`${branch}_openCall`] || 0;
          const totalVisits = totalAssigned - (newBreakdown + newInstallation + newPM + openCall);
          // const totalVisits = totalAssigned - openCall;
          totalVisitsSum += totalVisits;
          const ePoint = branchCallCount[`${branch}_ePoint`].toFixed(2) || 0;
          const bPoint = branchCallCount[`${branch}_bPoint`].toFixed(2) || 0;
          const rPoint = branchCallCount[`${branch}_rPoint`].toFixed(2) || 0;
          const closeBreakdown = branchCallCount[`${branch}_closeBreakdown`] || 0;
          const closeInstallation = branchCallCount[`${branch}_closeInstallation`] || 0;
          const closePM = branchCallCount[`${branch}_closePM`] || 0;
          const pCloseBreakdown = branchCallCount[`${branch}_pCloseBreakdown`] || 0;
          const pCloseInstallation = branchCallCount[`${branch}_pCloseInstallation`] || 0;
          const pClosePM = branchCallCount[`${branch}_pClosePM`] || 0;
          const accuracy = totalVisits
            ? (
                (100 *
                  (closeBreakdown +
                    closeInstallation +
                    closePM +
                    pCloseBreakdown +
                    pCloseInstallation +
                    pClosePM)) /
                totalVisits
              ).toFixed(2)
            : "0.00";
          const point = parseFloat(bPoint) + parseFloat(ePoint);
          const index = totalVisits
            ? (((parseFloat(bPoint) + parseFloat(ePoint)) * 1000) / totalVisits).toFixed(0)
            : 0;
          return {
            region: branchData.region,
            branch,
            engineer: uniqueEngineersPerBranch[branch] ? uniqueEngineersPerBranch[branch].size : 0,
            totalCallAssigned: totalAssigned,
            newBreakdown,
            newInstallation,
            newPM,
            pendBreakdown: branchCallCount[`${branch}_pendBreakdown`] || 0,
            pendInstallation: branchCallCount[`${branch}_pendInstallation`] || 0,
            pendPM: branchCallCount[`${branch}_pendPM`] || 0,
            closeBreakdown,
            closeInstallation,
            closePM,
            pCloseBreakdown,
            pCloseInstallation,
            pClosePM,
            totalVisits,
            // openCall,
            ePoint,
            bPoint,
            index,
            accuracy,
          };
        });
        // Calculate average totalVisits
        const averageTotalVisits = (totalVisitsSum / uniqueBranch.length).toFixed(2);
        // Create header row
        const header = {
          region: "Region",
          branch: "Branch",
          engineer: "Eng",
          totalCallAssigned: "Call",
          newBreakdown: "B",
          newInstallation: "I",
          newPM: "P",
          pendBreakdown: "B",
          pendInstallation: "I",
          pendPM: "P",
          closeBreakdown: "B",
          closeInstallation: "I",
          closePM: "P",
          pCloseBreakdown: "B",
          pCloseInstallation: "I",
          pClosePM: "P",
          totalVisits: "Visits",
          // openCall: "open call",
          ePoint: "E Point",
          bPoint: "B Point",
          index: "Score",
          accuracy: "%",
        };

        // Combine header with data
        const finalDataWithHeader = [header, ...finalData].filter((row) => row.region !== "");

        setData({ finalDataWithHeader, averageTotalVisits, filterYear: yearToUse });
      };
      processData();
    }
  }, [processedData, filterYear, setData]);
  return (
    <DashboardTableView
      data={data.finalDataWithHeader}
      averageTotalVisits={data.averageTotalVisits/3}
      filterYear={data.filterYear}
    />
  );
};

export default DataCompile;
