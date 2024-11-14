// app/api/proxy/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {

  const parseHTMLTable = (html) => {
    var data = [];
    var tableRegex = /<table[^>]*>(.*?)<\/table>/s;  // Changed to stop after the first table
    var rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
    var cellRegex = /<t[dh][^>]*>(.*?)<\/t[dh]>/gs;
    var tableMatch = tableRegex.exec(html);
    if (tableMatch) {
      var rows = tableMatch[1].match(rowRegex);
      rows.forEach(function(row) {
        var cells = row.match(cellRegex);
        var rowData = cells.map(function(cell) {
          return cell.replace(/<.*?>/g, '').trim();
        });
        data.push(rowData);
      });
    }
    return data;
  }
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
    const table = parseHTMLTable(response.data);
    return NextResponse.json(JSON.stringify(table, null, 2));
  } catch (error) {
    return NextResponse.json({ error: "Error fetching data from the server" }, { status: 500 });
  }
}
