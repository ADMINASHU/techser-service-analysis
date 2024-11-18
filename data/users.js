import User from "@/app/models/User";
import connectDB from "@/lib/db";

export const getUserByID = async (userID) => {
  try {
    await connectDB();
    // console.log(`Searching for user with ID: ${userID}`);
    const foundUser = await User.findOne({ userID });
    if (!foundUser) {
      throw new Error(`User with ID ${userID} not found`);
    }
    return foundUser;
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    throw new Error(`Error fetching user: ${error.message}`);
  }
};
