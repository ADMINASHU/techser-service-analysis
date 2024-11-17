// app/api/data/route.js
import connectToDatabase from '../../../lib/mongodb';
import Data from '../../models/Data';
import { NextResponse } from 'next/server';


export async function GET() {
  await connectToDatabase();

  const data = await Data.find({});

  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
