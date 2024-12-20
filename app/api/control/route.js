import connectToServiceEaseDB from "../../../lib/serviceDB";
import Point from '../../../models/Point';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectToServiceEaseDB();

    if (!db) {
      
      return NextResponse.json({ message: "Error connecting to the database" }, { status: 500 });
    }

    const points = await Point.find({});
    const data = points.reduce((acc, item) => {
      acc[item.category] = item.data;
      return acc;
    }, {});
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db = await connectToServiceEaseDB();

    if (!db) {
      return NextResponse.json({ message: "Error connecting to the database" }, { status: 500 });
    }

    const updatedPoints = await request.json();
    await Point.deleteMany({});

    const updates = Object.keys(updatedPoints).map((category) => {
      const categoryData = updatedPoints[category];
      return {
        category,
        data: {
          eng: {
            new: categoryData.eng.new,
            pending: categoryData.eng.pending,
            closed: Array.isArray(categoryData.eng.closed) ? categoryData.eng.closed : [categoryData.eng.closed]
          },
          branch: {
            new: categoryData.branch.new,
            pending: categoryData.branch.pending,
            closed: categoryData.branch.closed
          },
          region: {
            new: categoryData.region.new,
            pending: categoryData.region.pending,
            closed: categoryData.region.closed
          }
        }
      };
    });

    await Point.insertMany(updates);

    return NextResponse.json({ message: "Data updated successfully" }, { status: 200 });
  } catch (error) {
    // console.error('PUT error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
