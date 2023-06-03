import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router from 'next/router';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Grocery: NextPage = () => {
  const { data, error } = useSWR(
    `http://localhost:3010/api/v1/product/${router.query.id}`,
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div >
      console.log(data);
      {data.data.map((product: any) => (
        <li className='p-4' key={product.id}>
          <p>ID: {product.id}</p>
          <p>Created at: {product.created_at}</p>
          <p>Updated at: {product.updated_at}</p>
          <p>Category Grocery ID: {product.category_product_id}</p>
          <p>Sub Category Grocery ID: {product.sub_category_product_id}</p>
          <p>Item ID: {product.item_id}</p>
          <p>Maker ID: {product.maker_id}</p>
          <Link href={`http://localhost:3000/api/v1/products/${product.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Grocery;