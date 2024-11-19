
import React from "react";
import { auth } from "@/auth";
import Logout from "@/components/Logout";
import {redirect} from "next/navigation";


const Homepage = async () => {
  const session = await auth();
  // console.log("................"+JSON.stringify( session?.user));
  if (!session?.user) redirect("/");

  return (
    <div>
      <div>Home page</div>
      {/* <div>{session?.user}</div> */}
      <Logout/>
    </div>
  );
};

export default Homepage;
