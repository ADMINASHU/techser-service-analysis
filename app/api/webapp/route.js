import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await axios.get('https://script.google.com/macros/s/AKfycby8jP7TJO0iP-rxj4rTCfRwRq1nDoJzoqylmqKLOrv9MaEonusYnlh5q5DLjJtesV_Qbg/exec');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.error();
  }
}
