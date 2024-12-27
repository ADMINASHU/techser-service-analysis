import React from "react";
import { auth } from "@/auth";
import TableView from "./(components)/TableView";
import connectToServiceEaseDB from "@/lib/serviceDB";
import UserData from "@/models/UserData";
import ProfileView from "./(components)/ProfileView";
import styles from "./report.module.css";

const MyReportPage = async () => {
  const db = await connectToServiceEaseDB();
  const session = await auth();
  const loggedUser = session?.user;

  if (!db) {
    return { message: "Error connecting to the database" };
  }

  const userProfile = await UserData.findOne({ USERNAME: loggedUser?.userID });

  // if (!userProfile || !loggedUser) return null;

  return (
    <div className={styles.container}>
      <ProfileView userProfile={userProfile} loggedUser={loggedUser} />
      {userProfile && (
        <div className={styles.dataSection}>
          <TableView loggedUser={loggedUser} />
        </div>
      )}
    </div>
  );
};

export default MyReportPage;
