
import React from "react";
import { auth } from "@/auth";



const ProfilePage = async () => {
  const session = await auth();


  return (
    <div>
      <div>Profile Page</div>
      <div>{session?.user.email}</div>
    </div>
  );
};

export default ProfilePage;
