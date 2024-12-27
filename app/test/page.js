import { auth } from "@/auth";
import Seusers from "@/components/Seusers";
import React from "react";

const TestPage = async () => {
  const session = await auth();
  return (
    <div>
      <div>TestPage no login required</div>
      <div>{session?.user && JSON.stringify(session?.user)}</div>
      {/* <Seusers /> */}
    </div>
  );
};

export default TestPage;
