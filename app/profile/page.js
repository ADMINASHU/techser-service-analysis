import React from "react";
import { auth } from "@/auth";
import Profile from "@/components/Profile";
import styles from "../../components/Profile.module.css";

const ProfilePage = async () => {
  const session = await auth();
  const LoggedUserID = session?.user.userID;

  return (
    <div className={styles.profileContainer}>
      <Profile LoggedUserID={LoggedUserID} />
    </div>
  );
};

export default ProfilePage;
