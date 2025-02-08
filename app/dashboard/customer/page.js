import React from "react";
import styles from "../Dashboard.module.css";
import CustomerTable from "@/app/dashboard/customer/CustomerTable";

const page = () => {
  return (
    <div className={styles.dash}>
      <CustomerTable />
    </div>
  );
};

export default page;
