import { auth } from "@/auth";
import Users from "@/components/Users";
import styles from "../../components/Users.module.css";
import React from "react";

const UsersPage = async () => {
  const session = await auth();
  const LoggedUser = session?.user
  const LoggedUserLevel = session?.user.level;

  return (
    <div className={styles.userContainer}>
      <Users LoggedUserLevel={LoggedUserLevel} LoggedUser={LoggedUser}/>
    </div>
  );
};

export default UsersPage; 
