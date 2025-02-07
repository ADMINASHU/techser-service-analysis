import React from "react";
import styles from "../Dashboard.module.css";
import ProductTable from "@/components/ProductTable";

const page = () => {
  return (
    <div className={styles.dash}>
      <ProductTable />
    </div>
  );
};

export default page;
