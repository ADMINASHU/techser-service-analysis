import connectToServiceEaseDB from "../../../lib/serviceDB";
import { Data } from "../../models/Data";
import { NextResponse } from "next/server";
import axios from "axios";

async function fetchProData() {
  try {
    // const response = await axios.get('/api/proData');
    const response = await axios.get(`${process.env.BASE_URL}/api/proData`);
    return response.data;
  } catch (error) {
    console.error("Error fetching proData:", error.message);
    throw new Error("Failed to fetch proData");
  }
}

export async function POST(request) {
  try {
    const { year } = await request.json();
    const proData = await fetchProData();
    console.log("year:", year);
    // console.log("proData:", proData);
    //.................................................................................
    // Extract unique engineers
    const uniqueEngineers = [
      ...new Set(proData.map((item) => item.assignedTo).filter(Boolean)),
    ].sort();

    // Count occurrences of each engineer in proData based on conditions
    const engineerCallCount = proData.reduce((acc, item) => {
      if (item.assignedTo) {
        acc[item.assignedTo] = (acc[item.assignedTo] || 0) + 1;

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
    const finalData = uniqueEngineers.map((engineer) => {
      const engineerData = proData.find((item) => item.assignedTo === engineer);
      const totalAssigned = engineerCallCount[engineer];
      const newBreakdown = engineerCallCount[`${engineer}_newBreakdown`] || 0;
      const newInstallation = engineerCallCount[`${engineer}_newInstallation`] || 0;
      const newPM = engineerCallCount[`${engineer}_newPM`] || 0;
      const totalVisits = totalAssigned - (newBreakdown + newInstallation + newPM);
      const ePoint = engineerCallCount[`${engineer}_ePoint`].toFixed(2) || 0;
      const bPoint = engineerCallCount[`${engineer}_bPoint`].toFixed(2) || 0;
      const rPoint = engineerCallCount[`${engineer}_rPoint`].toFixed(2) || 0;
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
        region: engineerData.region,
        branch: engineerData.branch,
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
        bPoint,
        rPoint,
        index,
        accuracy,
      };
    });

    // Create header row
    const header = {
      region: "Region",
      branch: "Branch",
      engineer: "Engineer",
      totalCallAssigned: "Total Call Assigned",
      newBreakdown: "New Breakdown",
      newInstallation: "New Installation",
      newPM: "New PM",
      pendBreakdown: "Pending Breakdown",
      pendInstallation: "Pending Installation",
      pendPM: "Pending PM",
      closeBreakdown: "Closed Breakdown",
      closeInstallation: "Closed Installation",
      closePM: "Closed PM",
      pCloseBreakdown: "P Closed Breakdown",
      pCloseInstallation: "P Closed Installation",
      pClosePM: "P Closed PM",
      totalVisits: "Total Visits",
      ePoint: "E Point",
      bPoint: "B Point",
      rPoint: "R Point",
      index: "Index",
      accuracy: "Accuracy in %",
    };

    // Combine header with data
    const finalDataWithHeader = [header, ...finalData];

    // Log the final data
    // console.log(finalDataWithHeader);

    // Return the final data
    return NextResponse.json(finalDataWithHeader, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in POST request:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
