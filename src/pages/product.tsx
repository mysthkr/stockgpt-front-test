import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Product: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/products",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((product: any, index: number) => (
        <li className='p-4' key={product.id}>
          <p>ID: {product.id}</p>
          <p>Picture: {product.picture}</p>
          <p>Created at: {product.created_at}</p>
          <p>Updated at: {product.updated_at}</p>
          <p>Category Product ID: {product.category_product_id}</p>
          <p>Sub Category Product ID: {product.sub_category_product_id}</p>
          <p>Item ID: {product.item_id}</p>
          <p>Maker ID: {product.maker_id}</p>
          <Link href={`http://localhost:3000/product/${product.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Product;