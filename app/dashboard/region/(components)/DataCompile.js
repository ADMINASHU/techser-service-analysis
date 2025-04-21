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
        const filterProcessedData = processedData.filter(
          (item) => item.year === yearToUse
        );

        const uniqueEngineersPerRegion = filterProcessedData.reduce((acc, item) => {
          if (item.assignedTo && item.account.erRegion) {
            if (!acc[item.account.erRegion]) {
              acc[item.account.erRegion] = new Set();
            }
            acc[item.account.erRegion].add(item.assignedTo);
          }
          return acc;
        }, {});
        const uniqueBranchPerRegion = filterProcessedData.reduce((acc, item) => {
          if (item.branch && item.region) {
            if (!acc[item.region]) {
              acc[item.region] = new Set();
            }
            acc[item.region].add(item.branch);
          }
          return acc;
        }, {});

        const uniqueRegion = [
          ...new Set(filterProcessedData.map((item) => item.region).filter(Boolean)),
        ].sort();

        // Count occurrences of each engineer in processedData based on conditions
        const regionCallCount = filterProcessedData.reduce((acc, item) => {
          if (item.region) {
            acc[item.region] = (acc[item.region] || 0) + 1;

            if (item.realStatus === "NEW") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.region}_newBreakdown`] = (acc[`${item.region}_newBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.region}_newInstallation`] =
                  (acc[`${item.region}_newInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.region}_newPM`] = (acc[`${item.region}_newPM`] || 0) + 1;
              }
            } else if (item.realStatus === "IN PROCESS") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.region}_pendBreakdown`] =
                  (acc[`${item.region}_pendBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.region}_pendInstallation`] =
                  (acc[`${item.region}_pendInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.region}_pendPM`] = (acc[`${item.region}_pendPM`] || 0) + 1;
              }
            } else if (item.realStatus === "COMPLETED" && item.isPending === "") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.region}_closeBreakdown`] =
                  (acc[`${item.region}_closeBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.region}_closeInstallation`] =
                  (acc[`${item.region}_closeInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.region}_closePM`] = (acc[`${item.region}_closePM`] || 0) + 1;
              }
            } else if (item.realStatus === "COMPLETED" && item.isPending === "TRUE") {
              if (item.natureOfComplaint === "BREAKDOWN") {
                acc[`${item.region}_pCloseBreakdown`] =
                  (acc[`${item.region}_pCloseBreakdown`] || 0) + 1;
              } else if (item.natureOfComplaint === "INSTALLATION") {
                acc[`${item.region}_pCloseInstallation`] =
                  (acc[`${item.region}_pCloseInstallation`] || 0) + 1;
              } else if (item.natureOfComplaint === "PM") {
                acc[`${item.region}_pClosePM`] = (acc[`${item.region}_pClosePM`] || 0) + 1;
              }
            }
            // Sum ePoint, bPoint, and rPoint for each engineer, handle negative values correctly
            acc[`${item.region}_ePoint`] =
              (acc[`${item.region}_ePoint`] || 0) + (parseFloat(item.ePoint) || 0);
            acc[`${item.region}_bPoint`] =
              (acc[`${item.region}_bPoint`] || 0) + (parseFloat(item.bPoint) || 0);
            acc[`${item.region}_rPoint`] =
              (acc[`${item.region}_rPoint`] || 0) + (parseFloat(item.rPoint) || 0);
          }
          return acc;
        }, {});
        // Map unique engineers to regions and branches
        let totalVisitsSum = 0;
        // Map unique engineers to regions and branches
        const finalData = uniqueRegion.map((region) => {
          // console.log(uniqueEngineersPerBranch[branch]);

          // const regionData = processedData.find((item) => item.region === region);
          const totalAssigned = regionCallCount[region];
          const newBreakdown = regionCallCount[`${region}_newBreakdown`] || 0;
          const newInstallation = regionCallCount[`${region}_newInstallation`] || 0;
          const newPM = regionCallCount[`${region}_newPM`] || 0;
          const totalVisits = totalAssigned - (newBreakdown + newInstallation + newPM);
          totalVisitsSum += totalVisits;
          const ePoint = regionCallCount[`${region}_ePoint`].toFixed(2) || 0;
          const bPoint = regionCallCount[`${region}_bPoint`].toFixed(2) || 0;
          const rPoint = regionCallCount[`${region}_rPoint`].toFixed(2) || 0;
          const closeBreakdown = regionCallCount[`${region}_closeBreakdown`] || 0;
          const closeInstallation = regionCallCount[`${region}_closeInstallation`] || 0;
          const closePM = regionCallCount[`${region}_closePM`] || 0;
          const pCloseBreakdown = regionCallCount[`${region}_pCloseBreakdown`] || 0;
          const pCloseInstallation = regionCallCount[`${region}_pCloseInstallation`] || 0;
          const pClosePM = regionCallCount[`${region}_pClosePM`] || 0;
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
          // const point = parseFloat(bPoint) + parseFloat(ePoint);
          const index = totalVisits
            ? (
                ((parseFloat(bPoint) + parseFloat(ePoint) + parseFloat(rPoint)) * 1000) /
                totalVisits
              ).toFixed(0)
            : 0;
          return {
            region,
            branch: uniqueBranchPerRegion[region] ? uniqueBranchPerRegion[region].size : 0,
            engineer: uniqueEngineersPerRegion[region] ? uniqueEngineersPerRegion[region].size : 0,
            totalCallAssigned: totalAssigned,
            newBreakdown,
            newInstallation,
            newPM,
            pendBreakdown: regionCallCount[`${region}_pendBreakdown`] || 0,
            pendInstallation: regionCallCount[`${region}_pendInstallation`] || 0,
            pendPM: regionCallCount[`${region}_pendPM`] || 0,
            closeBreakdown,
            closeInstallation,
            closePM,
            pCloseBreakdown,
            pCloseInstallation,
            pClosePM,
            totalVisits,
            ePoint,
            bPoint,
            rPoint,
            index,
            accuracy,
          };
        });
        // Calculate average totalVisits
        const averageTotalVisits = (totalVisitsSum / uniqueRegion.length).toFixed(2);

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
          ePoint: "E Point",
          bPoint: "B Point",
          rPoint: "R Point",
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
      averageTotalVisits={data.averageTotalVisits/4}
      filterYear={data.filterYear}
    />
  );
};

export default DataCompile;
