// import { auth } from "@/auth";
import Users from "@/components/Users";

import React from "react";

const UsersPage = async () => {
  // const session = await auth();
  const LoggedUserLevel = true;

  return (
    <div >
      <Users LoggedUserLevel={LoggedUserLevel} />
    </div>
  );
};

export default UsersPage;
