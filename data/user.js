import client from "@/lib/db"; // Ensure the path is correct
import { User } from "@/app/models/User";

export const getUserByEmail = async (email) => {
  try {
    await client.connect(); // Connect to the database
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  } finally {
    await client.close(); // Close the connection
  }
};

export const getUserById = async (id) => {
  try {
    await client.connect(); // Connect to the database
    const user = await User.findOne({ _id: id });
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  } finally {
    await client.close(); // Close the connection
  }
};

export const getUserByUserID = async (userID) => {
  try {
    await client.connect(); // Connect to the database
    const user = await User.findOne({ userID });
    return user;
  } catch (error) {
    console.error("Error fetching user by userID:", error);
    return null;
  } finally {
    await client.close(); // Close the connection
  }
};
