import { NextResponse } from 'next/server';
import  User  from '../../../../lib/models/User';
import connectToServiceEaseDB from '../../../../lib/serviceDB';

export async function DELETE(request, { params }) {
  const { userID } = params;

  try {
    await connectToServiceEaseDB();
    const user = await User.findOneAndDelete({ userID });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
