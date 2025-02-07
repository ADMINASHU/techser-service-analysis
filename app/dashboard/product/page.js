import React from "react";
import styles from "../Dashboard.module.css";
import ProductCompile from "./(component)/ProductCompile";

const page = () => {
  return (
    <div className={styles.dash}>
      <ProductCompile/> 
    </div>
  );
};

export default page;
