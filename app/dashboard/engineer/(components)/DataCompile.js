"use client";

import { useState, useEffect, useContext } from "react";
import DashboardTableView from "./DashboardTableView";
import DataContext from "@/context/DataContext";

const DataCompile = () => {
  const { processedData, filterYear, yearLoading } = useContext(DataContext);
  const [data, setData] = useState({});
  const currentYear = new Date().getFullYear().toString();

  useEffect(() => {
    if (processedData.length > 0 && !yearLoading) {
      const processData = async () => {
        const yearToUse = filterYear || currentYear;
        const filterProcessedData = processedData.filter(
          (item) => item.year === yearToUse
        );
        const uniqueEngineers = [
          ...new Set(filterProcessedData.map((item) => item.assignedTo).filter(Boolean)),
        ].sort();

        // Count occurrences of each engineer in processedData based on conditions
        const engineerCallCount = filterProcessedData.reduce((acc, item) => {
          if (item.assignedTo) {
            acc[item.assignedTo] = (acc[item.assignedTo] || 0) + 1;

            if (!item.closedDate && item.realStatus !== "NEW") {
              acc[`${item.assignedTo}_openCall`] = (acc[`${item.assignedTo}_openCall`] || 0) + 1;
            }

            if (item.realStatus === "NEW") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.assignedTo}_newBreakdown`] =
                  (acc[`${item.assignedTo}_newBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.assignedTo}_newInstallation`] =
                  (acc[`${item.assignedTo}_newInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.assignedTo}_newPM`] = (acc[`${item.assignedTo}_newPM`] || 0) + 1;
              }
            } else if (item.realStatus === "IN PROCESS") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.assignedTo}_pendBreakdown`] =
                  (acc[`${item.assignedTo}_pendBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.assignedTo}_pendInstallation`] =
                  (acc[`${item.assignedTo}_pendInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.assignedTo}_pendPM`] = (acc[`${item.assignedTo}_pendPM`] || 0) + 1;
              }
            } else if (item.realStatus === "COMPLETED" && item.isPending === "") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.assignedTo}_closeBreakdown`] =
                  (acc[`${item.assignedTo}_closeBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.assignedTo}_closeInstallation`] =
                  (acc[`${item.assignedTo}_closeInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.assignedTo}_closePM`] = (acc[`${item.assignedTo}_closePM`] || 0) + 1;
              }
            } else if (item.realStatus === "COMPLETED" && item.isPending === "TRUE") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.assignedTo}_pCloseBreakdown`] =
                  (acc[`${item.assignedTo}_pCloseBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.assignedTo}_pCloseInstallation`] =
                  (acc[`${item.assignedTo}_pCloseInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.assignedTo}_pClosePM`] = (acc[`${item.assignedTo}_pClosePM`] || 0) + 1;
              }
            }
            // Sum ePoint, bPoint, and rPoint for each engineer, handle negative values correctly
            acc[`${item.assignedTo}_ePoint`] =
              (acc[`${item.assignedTo}_ePoint`] || 0) + (parseFloat(item.ePoint) || 0);
            acc[`${item.assignedTo}_bPoint`] =
              (acc[`${item.assignedTo}_bPoint`] || 0) + (parseFloat(item.bPoint) || 0);
            acc[`${item.assignedTo}_rPoint`] =
              (acc[`${item.assignedTo}_rPoint`] || 0) + (parseFloat(item.rPoint) || 0);
          }
          return acc;
        }, {});

        // Map unique engineers to regions and branches
        let totalVisitsSum = 0;
        const finalData = uniqueEngineers.map((engineer) => {
          const engineerData = filterProcessedData.find((item) => item.assignedTo === engineer);
          const totalAssigned = engineerCallCount[engineer];
          const newBreakdown = engineerCallCount[`${engineer}_newBreakdown`] || 0;
          const newInstallation = engineerCallCount[`${engineer}_newInstallation`] || 0;
          const newPM = engineerCallCount[`${engineer}_newPM`] || 0;
          const openCall = engineerCallCount[`${engineer}_openCall`] || 0;
          const totalVisits = totalAssigned - (newBreakdown + newInstallation + newPM + openCall);
          // const totalVisits = totalAssigned - openCall;
          totalVisitsSum += totalVisits;
          const ePoint = engineerCallCount[`${engineer}_ePoint`].toFixed(2) || 0;
          const closeBreakdown = engineerCallCount[`${engineer}_closeBreakdown`] || 0;
          const closeInstallation = engineerCallCount[`${engineer}_closeInstallation`] || 0;
          const closePM = engineerCallCount[`${engineer}_closePM`] || 0;
          const pCloseBreakdown = engineerCallCount[`${engineer}_pCloseBreakdown`] || 0;
          const pCloseInstallation = engineerCallCount[`${engineer}_pCloseInstallation`] || 0;
          const pClosePM = engineerCallCount[`${engineer}_pClosePM`] || 0;
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
          const index = totalVisits ? ((ePoint * 1000) / totalVisits).toFixed(0) : 0;
          return {
            region: engineerData.account.erRegion,
            branch: engineerData.account.erBranch,
            engineer,
            totalCallAssigned: totalAssigned,
            newBreakdown,
            newInstallation,
            newPM,
            pendBreakdown: engineerCallCount[`${engineer}_pendBreakdown`] || 0,
            pendInstallation: engineerCallCount[`${engineer}_pendInstallation`] || 0,
            pendPM: engineerCallCount[`${engineer}_pendPM`] || 0,
            closeBreakdown,
            closeInstallation,
            closePM,
            pCloseBreakdown,
            pCloseInstallation,
            pClosePM,
            totalVisits,
            ePoint,
            // openCall, // Add openCall to the final data
            index,
            accuracy,
            account: engineerData.account, // Add account to the final data, assuming account is a field in the processedData object. If not, you can remove this line and add account to the header row instead.
          };
        });

        // Calculate average totalVisits
        const averageTotalVisits = (totalVisitsSum / uniqueEngineers.length).toFixed(2);

        // Create header row
        const header = {
          region: "Region",
          branch: "Branch",
          engineer: "Engineer",
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
          ePoint: "E Point",
          // openCall: "Open Call", // Add openCall to the header row
          index: "Score",
          accuracy: "%",
          account: "Account",
        };

        // Combine header with data
        const finalDataWithHeader = [header, ...finalData];

        setData({ finalDataWithHeader, averageTotalVisits, filterYear: yearToUse });
      };

      processData();
    }
  }, [processedData, filterYear, yearLoading]);

  if (yearLoading) {
    return <div>Loading year data...</div>;
  }

  return (
    <DashboardTableView
      data={data.finalDataWithHeader}
      averageTotalVisits={data.averageTotalVisits/2}
      filterYear={data.filterYear}
    />
  );
};

export default DataCompile;
