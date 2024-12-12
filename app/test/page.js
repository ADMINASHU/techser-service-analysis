import React from "react";
import { auth } from "@/auth";

const testPage = async () => {
  const session = await auth();
  return (
    <div>
      <div>TestPage no login required</div>
      {JSON.stringify(session)}
    </div>
  );
};

export default testPage;
