
import React from "react";
import { auth } from "@/auth";
import Profile from "@/components/Profile";



const ProfilePage = async () => {
  const session = await auth();
  const LoggedUserID = session?.user.userID;


  return (
    <div>
      <Profile LoggedUserID= {LoggedUserID}/>  
    </div>
  );
};

export default ProfilePage;
