import React from "react";
import { auth } from "@/auth";
import DataExtractor from "./(components)/DataExtractor";
import TableView from "./(components)/TableView";

const MyReportPage = async () => {
  const session = await auth();
  const loggedUser = session?.user;
  
  return (
    <div>
      <p>{JSON.stringify(loggedUser)}</p>
      <DataExtractor />
      <TableView/>  
    </div>
  );
};

export default MyReportPage;
