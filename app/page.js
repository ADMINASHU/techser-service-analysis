
import React from "react";
import { auth } from "@/auth";
import Logout from "@/components/Logout";
import {redirect} from "next/navigation";


const Homepage = async () => {
  const session = await auth();


  return (
    <div>
      <div>Home page</div>
      <div>{session?.user.email}</div>
      <Logout/>
    </div>
  );
};

export default Homepage;
