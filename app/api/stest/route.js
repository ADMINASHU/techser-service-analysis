import connectToServiceEaseDB from "../../../lib/serviceDB";
import { Data } from "../../../models/Data";
import Point from "../../../models/Point";
import { NextResponse } from "next/server";
import { parse, differenceInHours, format, isValid } from "date-fns";

export async function GET() {
  try {
    const db = await connectToServiceEaseDB();

    if (!db) {
      // console.error("Database connection failed");
      return NextResponse.status(500).json({ message: "Error connecting to the database" });
    }

    const data = await Data.find({});
    const point = await Point.find({}).select("category data");
    if (!point || !data) {
      // console.error("Error fetching points and data from database");
      return NextResponse.status(500).json({ message: "Error fetching points and data from database" });
    }

    const points = point.reduce((acc, item) => {
      acc[item.category] = item.data;
      return acc;
    }, {});

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

    const parseDate = (dateStr) => {
      const dates = dateStr.match(/\d{2}\.\w{3}\.\d{4} \d{2}:\d{2}/g);
      return dates ? dates[dates.length - 1] : null;
    };

    const newData = data.reduce((acc, item) => {
      const callDate = item.callDate;
      const dateStr = item.callStartEndDate;
      const lastDate = dateStr ? parseDate(dateStr) : null;
      const parsedCallDate = callDate ? parse(callDate, "dd.MMM.yyyy HH:mm", new Date()) : null;
      const parsedLastDate = lastDate ? parse(lastDate, "dd.MMM.yyyy HH:mm", new Date()) : new Date();

      if (!isValid(parsedCallDate) || !isValid(parsedLastDate)) {
        // console.warn("Invalid date values found:", { parsedCallDate, parsedLastDate });
        return acc;
      }

      const duration = parsedCallDate && parsedLastDate ? ((differenceInHours(parsedLastDate, parsedCallDate) / 24).toFixed(2)) + ' days' : '';

      if (!duration || parseFloat(duration) < 0) return acc;

      const complaintID = item.callNo.match(/B\d{2}[A-Z]\d+-\d+(?:-\d+)?/)?.[0] || '';
      const originalComplaintID = complaintID.includes("-") ? complaintID.split("-").slice(0, 2).join("-") : complaintID;
      const status = item.callNo.match(/(COMPLETED|NEW|IN PROCESS)/)?.[0] || '';
      const natureOfComplaint = item.callNo.match(/(BREAKDOWN|INSTALLATION|PM)/)?.[0] || '';
      const assignedTo = item.engineerName.match(/^[A-Za-z]+(?: [A-Za-z]+)?/)?.[0] !== "NOT ALLOCATED" ? item.engineerName.match(/^[A-Za-z]+(?: [A-Za-z]+)?/)?.[0] : '';
      const regionPattern = new RegExp(regionList.map(region => region.toUpperCase()).join("|"), "g");
      const region = item.regionBranch.toUpperCase().match(regionPattern)?.[0] || '';
      const branch = item.regionBranch.toUpperCase().replace(regionPattern, "").trim() || region;
      const month = parsedCallDate ? format(parsedCallDate, "MMM") : '';
      const year = parsedCallDate ? format(parsedCallDate, "yyyy") : '';

      acc.push({
        regDate: callDate,
        closedDate: lastDate || '',
        duration,
        complaintID,
        origComplaintID: originalComplaintID,
        natureOfComplaint,
        status,
        assignedTo,
        region,
        branch,
        month,
        year,
      });
      return acc;
    }, []);

    const countMap = new Map();
    newData.forEach(item => {
      if (item.origComplaintID) {
        countMap.set(item.origComplaintID, (countMap.get(item.origComplaintID) || 0) + 1);
      }
    });

    const finalData = newData.map(item => ({
      ...item,
      count: countMap.get(item.origComplaintID) || 0,
    }));

    const finalSData = finalData.map(item => {
      const lastSegmentNumber = parseInt(item.complaintID.split("-")[2]) || 0;
      const realStatus = (lastSegmentNumber < item.count - 1 && item.status === "COMPLETED") ? "IN PROCESS" : item.status;
      return { ...item, realStatus };
    });

    const finalPendingData = finalSData.map(item => ({
      ...item,
      isPending: parseInt(item.complaintID.split("-")[2]) > 0 ? "TRUE" : "",
    }));

    const finalPointData = finalPendingData.map(item => {
      const isPending = item.isPending;
      const count = parseInt(item.complaintID.split("-")[2]) || 0;
      const natureOfComplaint = item.natureOfComplaint;
      const realStatus = item.realStatus;
      const duration = parseFloat(item.duration);

      const cPoint = isPending ? points[natureOfComplaint].eng.closed[Math.min(2, count - 1)] : points[natureOfComplaint].eng.closed[0];
      const ePoint = realStatus === "NEW" ? points[natureOfComplaint].eng.new : realStatus === "IN PROCESS" ? points[natureOfComplaint].eng.pending : cPoint;
      const freeDay = 3;

      const bPoint = (() => {
        if (natureOfComplaint === "BREAKDOWN" && duration > freeDay) {
          return (duration - freeDay) * points[natureOfComplaint].branch[realStatus.toLowerCase()];
        }
        return points[natureOfComplaint].branch[realStatus.toLowerCase()] || 0;
      })();

      const rPoint = points[natureOfComplaint].region[realStatus.toLowerCase()] || 0;

      return {
        ...item,
        cPoint,
        ePoint,
        bPoint: bPoint === 0 ? bPoint : bPoint.toFixed(2),
        rPoint,
      };
    }).filter(row => row.region !== "Region");

    return NextResponse.json(finalPointData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // console.error("Error in GET request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
