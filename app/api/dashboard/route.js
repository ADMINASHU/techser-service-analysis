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

    return NextResponse.json( proData , {
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
