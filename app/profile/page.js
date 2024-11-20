
import React from "react";
import { auth } from "@/auth";
import Logout from "@/components/Logout";



const ProfilePage = async () => {
  const session = await auth();


  return (
    <div>
      <div>Profile Page</div>
      <div>{session?.user.email}</div>
      <Logout/>
    </div>
  );
};

export default ProfilePage;
