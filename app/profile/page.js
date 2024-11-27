
import React from "react";
import { auth } from "@/auth";
import Profile from "@/components/Profile";



const ProfilePage = async () => {
  const session = await auth();
  // console.log(session);


  return (
    <div>
      
      <div>Profile Page</div>
      {/* <div>{session?.user.email}</div> */}
      <div>{JSON.stringify(session)}</div>
      <Profile user= {session?.user}/>  
    </div>
  );
};

export default ProfilePage;
