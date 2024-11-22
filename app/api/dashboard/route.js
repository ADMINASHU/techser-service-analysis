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

    // const uniqueEngineers = [...new Set(proData.map(item => item["engineer"]))];

    // const finalPointData = proData.map((item, index) => {
    //   if (index === 0) {
    //     // Header row
    //     return {
    //       regionList: "Region",
    //       branchList: "Branch",
    //       engineerList: "Engineer",
    //     };
    //   } else {
    //     const region = item["region"]; // Just for testing
    //     const branch = item["branch"]; // Just for testing
    //     const engineer = item["engineer"]; // Just for testing

    //     return {
    //       regionList: region,
    //       branchList: branch,
    //       engineerList: engineer,
    //     };
    //   }
    // });

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
        }
      }
      return acc;
    }, {});

    // Map unique engineers to regions and branches
    const finalData = uniqueEngineers.map((engineer) => {
      const engineerData = proData.find((item) => item.assignedTo === engineer);
      return {
        region: engineerData.region,
        branch: engineerData.branch,
        engineer,
        totalCallAssigned: engineerCallCount[engineer],
        newBreakdown: engineerCallCount[`${engineer}_newBreakdown`] || 0,
        newInstallation: engineerCallCount[`${engineer}_newInstallation`] || 0,
        newPM: engineerCallCount[`${engineer}_newPM`] || 0,
        pendBreakdown: engineerCallCount[`${engineer}_pendBreakdown`] || 0,
        pendInstallation: engineerCallCount[`${engineer}_pendInstallation`] || 0,
        pendPM: engineerCallCount[`${engineer}_pendPM`] || 0,
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
