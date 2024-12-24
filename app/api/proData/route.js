import connectToServiceEaseDB from "../../../lib/serviceDB";
import { Data } from "../../../models/Data";
import Point from "../../../models/Point";
import UserData from "../../../models/UserData";
import { NextResponse } from "next/server";
import { parse, differenceInHours, format, isValid } from "date-fns";
import { regionList } from "@/lib/regions";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startRow = parseInt(searchParams.get("startRow")) || 0;
  const chunkSize = parseInt(searchParams.get("chunkSize")) || 400;

  try {
    const db = await connectToServiceEaseDB();

    if (!db) {
      return NextResponse.status(500).json({ message: "Error connecting to the database" });
    }

    // Fetch user data from the serviceEaseUsers API

    const users = await UserData.find({});
    const point = await Point.find({});

    const data = await Data.find({}).skip(startRow).limit(chunkSize);
    if (!point || !data) {
      return NextResponse.status(500).json({
        message: "Error fetching points and data from database",
      });
    }

    const points = point.reduce((acc, item) => {
      acc[item.category] = item.data;
      return acc;
    }, {});

    const parseDate = (dateStr) => {
      const dates = dateStr.match(/\d{2}\.\w{3}\.\d{4} \d{2}:\d{2}/g);
      return dates ? dates[dates.length - 1] : null;
    };

    const newData = data.reduce((acc, item) => {
      const callDate = item.callDate;
      const dateStr = item.callStartEndDate;
      const lastDate = dateStr ? parseDate(dateStr) : null;
      const parsedCallDate = callDate ? parse(callDate, "dd.MMM.yyyy HH:mm", new Date()) : null;
      const parsedLastDate = lastDate
        ? parse(lastDate, "dd.MMM.yyyy HH:mm", new Date())
        : new Date();

      if (!isValid(parsedCallDate) || !isValid(parsedLastDate)) {
        return acc;
      }

      const duration =
        parsedCallDate && parsedLastDate
          ? (differenceInHours(parsedLastDate, parsedCallDate) / 24).toFixed(2) + " days"
          : "";

      if (!duration || parseFloat(duration) < 0) return acc;

      const complaintID = item.callNo.match(/B\d{2}[A-Z]\d+-\d+(?:-\d+)?/)?.[0] || "";
      const originalComplaintID = complaintID.includes("-")
        ? complaintID.split("-").slice(0, 2).join("-")
        : complaintID;
      const status = item.callNo.match(/(COMPLETED|NEW|IN PROCESS)/)?.[0] || "";
      const natureOfComplaint = item.callNo.match(/(BREAKDOWN|INSTALLATION|PM)/)?.[0] || "";
      const assignedTo =
        item.engineerName.match(/^[A-Za-z]+(?: [A-Za-z]+)?/)?.[0] !== "NOT ALLOCATED"
          ? item.engineerName.match(/^[A-Za-z]+(?: [A-Za-z]+)?/)?.[0]
          : "";
      const regionPattern = new RegExp(
        regionList.map((region) => region.toUpperCase()).join("|"),
        "g"
      );
      const region = item.regionBranch.toUpperCase().match(regionPattern)?.[0] || "";
      const branch = item.regionBranch.toUpperCase().replace(regionPattern, "").trim() || region;
      const month = parsedCallDate ? format(parsedCallDate, "MMM") : "";
      const year = parsedCallDate ? format(parsedCallDate, "yyyy") : "";

      acc.push({
        regDate: callDate,
        closedDate: lastDate || "",
        duration,
        complaintID,
        origComplaintID: originalComplaintID,
        natureOfComplaint,
        status,
        assignedTo,
        region,
        branch: branch === "BHOOPAL" ? "BHOPAL" : branch,
        month,
        year,
      });
      return acc;
    }, []);

    const countMap = new Map();
    newData.forEach((item) => {
      if (item.origComplaintID) {
        countMap.set(item.origComplaintID, (countMap.get(item.origComplaintID) || 0) + 1);
      }
    });

    const finalData = newData.map((item) => ({
      ...item,
      count: countMap.get(item.origComplaintID) || 0,
    }));

    const finalSData = finalData.map((item) => {
      const lastSegmentNumber = parseInt(item.complaintID.split("-")[2]) || 0;
      const realStatus =
        lastSegmentNumber < item.count - 1 && item.status === "COMPLETED"
          ? "IN PROCESS"
          : item.status;
      return { ...item, realStatus };
    });

    const finalPendingData = finalSData.map((item) => ({
      ...item,
      isPending: parseInt(item.complaintID.split("-")[2]) > 0 ? "TRUE" : "",
    }));

    const finalPointData = finalPendingData
      .map((item) => {
        const isPending = item.isPending;
        const count = parseInt(item.complaintID.split("-")[2]) || 0;
        const natureOfComplaint = item.natureOfComplaint;
        const realStatus = item.realStatus;
        const duration = parseFloat(item.duration);

        const cPoint = isPending
          ? points[natureOfComplaint].eng.closed[Math.min(2, count - 1)]
          : points[natureOfComplaint].eng.closed[0];
        const ePoint =
          realStatus === "NEW"
            ? points[natureOfComplaint].eng.new
            : realStatus === "IN PROCESS"
            ? item.closedDate
              ? points[natureOfComplaint].eng.pending
              : 0
            : cPoint;

        const bPoint = (() => {
          const freeDay = 3;
          let point = 0;
          if (natureOfComplaint === "BREAKDOWN" && duration > freeDay) {
            if (realStatus === "NEW") {
              point = (duration - freeDay) * points[natureOfComplaint].branch.new;
            } else if (realStatus === "IN PROCESS") {
              point = (duration - freeDay) * points[natureOfComplaint].branch.pending;
            } else {
              point = (duration - freeDay) * points[natureOfComplaint].branch.closed;
            }
          } else if (natureOfComplaint !== "BREAKDOWN") {
            if (realStatus === "NEW") {
              point = points[natureOfComplaint].branch.new;
            } else if (realStatus === "IN PROCESS") {
              point = points[natureOfComplaint].branch.pending;
            } else {
              point = points[natureOfComplaint].branch.closed;
            }
          }
          return point.toFixed(2);
        })();
        const rPoint = (() => {
          const freeDay = 3;
          let point = 0;
          if (realStatus === "NEW") {
            point = points[natureOfComplaint].region.new;
          } else if (realStatus === "IN PROCESS") {
            point = points[natureOfComplaint].region.pending;
          } else {
            point = points[natureOfComplaint].region.closed;
          }
          return point.toFixed(2);
        })();

        // Find the matching user
        const matchingUser = users.find((user) =>
          user.NAME.includes(item.assignedTo?.toUpperCase())
        );
        // console.log(item)
        const erID = item.assignedTo ? (matchingUser ? matchingUser.USERNAME : "") : "";
        const erName = item.assignedTo ? (matchingUser ? matchingUser.NAME : "") : "";
        const erMob = item.assignedTo ? (matchingUser ? matchingUser.PHONENO : "") : "";
        const erEmail = item.assignedTo ? (matchingUser ? matchingUser.EMAIL : "") : "";
        const erDesignation = item.assignedTo ? (matchingUser ? matchingUser.DESIGNATION : "") : "";
        const erWorkLocation = item.assignedTo ? (matchingUser ? matchingUser.WORKLOCATION : "") : "";
        const erBranch = item.assignedTo ? (matchingUser ? matchingUser.BRANCH : "") : "";
        const erRegion = item.assignedTo ? (matchingUser ? matchingUser.REGION : "") : "";
        const erAddress = item.assignedTo ? (matchingUser ? matchingUser.ADDRESS : "") : "";
        const erDistrict = item.assignedTo ? (matchingUser ? matchingUser.DISTRICT : "") : "";
        const erState = item.assignedTo ? (matchingUser ? matchingUser.STATE : "") : "";
        const erPincode = item.assignedTo ? (matchingUser ? matchingUser.PINCODE : "") : "";

        const account = {
          erID,
          erName,
          erMob,
          erEmail,
          erDesignation,
          erWorkLocation,
          erBranch,
          erRegion,
          erAddress,
          erDistrict,
          erState,
          erPincode,
        };
        return {
          ...item,
          cPoint,
          ePoint,
          bPoint,
          rPoint,
          account,
        };
      })
      .filter((row) => row.region !== "Region");

    const totalRows = await Data.countDocuments();

    return NextResponse.json(
      { finalPointData, totalRows },
      {
        status: 200,
        headers: {
          "Content-Type": "application/x-javascript; charset=utf-8",
          "Cache-Control": "max-age=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
