
import { auth } from "@/auth";
import Logout from "@/components/Logout";
import {redirect} from "next/navigation";

import React from "react";

const Homepage = async () => {
  const session = await auth();
  console.log("................"+session);
  if (!session?.user) redirect("/");

  return (
    <div>
      <div>Home page</div>
      <div>{session?.user?.userID}</div>
      <Logout/>
    </div>
  );
};

export default Homepage;
