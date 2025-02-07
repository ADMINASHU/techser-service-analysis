"use client";

import React, { useContext } from "react";
import ProductContext from "@/context/ProductContext";
import ProductTable from "./ProductTable";

const ProductCompile = () => {
  const { productData } = useContext(ProductContext);
  return <ProductTable productData={productData} />;
};

export default ProductCompile;
