
import React from "react";
import { auth } from "@/auth";
import Profile from "@/components/Profile";



const ProfilePage = async () => {
  const session = await auth();
  const LoggedUserID = session?.user.userID;


  return (
    <div 
    style={{height:"80vh"}}
    >
      <h1>Profile</h1>

      <Profile LoggedUserID= {LoggedUserID}/>  
    </div>
  );
};

export default ProfilePage;
