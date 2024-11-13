// app/api/proxy/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const { payload, cookies } = await request.json();
    const response = await axios.post(
      "http://serviceease.techser.com/live/index.php/calls/callsOnFilter",
      payload,
      {
        // method: "post",
        headers: {
        //   "Authorization": "Basic " + Utilities.base64Encode("admin:password"),
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "*/*",
          "Connection": "keep-alive",
          "Referer": "http://serviceease.techser.com/live/index.php/calls/index/All",
          "X-Requested-With": "XMLHttpRequest",
          "Cookie": cookies,
        },
      }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data from the server" }, { status: 500 });
  }
}
