// app/api/proxy/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await axios.post("http://serviceease.techser.com/live/index.php/login", body, {
      method: 'post',
      headers: {
        'Accept':
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "max-age=0",
        'Connection': "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        'Origin': "http://serviceease.techser.com",
        'Referer': "http://serviceease.techser.com/live/",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      },
      followRedirects: false,
    });
    const cookies = response.headers.get("Set-Cookie");
    const res = NextResponse.json(response.data);
    if (cookies) {
      cookies.forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
      });
    }
    return res;
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data from the server" }, { status: 500 });
  }
}
