import { auth } from "@/auth";
import React from "react";

const TestPage = async () => {
  const session = await auth();
  return (
    <div>
      <div>TestPage no login required</div>
      <div>{session?.user && JSON.stringify(session?.user)}</div>
    </div>
  );
};

export default TestPage;
