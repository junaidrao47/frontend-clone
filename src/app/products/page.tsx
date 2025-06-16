import { Suspense } from "react";
import Product1 from "../components/ProductPage/Product1";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Product1 />
    </Suspense>
  );
}