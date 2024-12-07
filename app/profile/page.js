
import React from "react";
import { auth } from "@/auth";
import Profile from "@/components/Profile";



const ProfilePage = async () => {
  const session = await auth();
  const LoggedUserID = session?.user.userID;


  return (
    <div style={{height:"80vh", display:"flex", flexDirection:"column" }}>
      <h1>Profile Page</h1>

      <Profile LoggedUserID= {LoggedUserID}/>  
    </div>
  );
};

export default ProfilePage;
