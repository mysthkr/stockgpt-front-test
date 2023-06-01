import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// const Grocery = {
//   id: "number",
//   picture: 'picture_url',
//   created_at: 'creation_date',
//   updated_at: 'update_date',
//   category_product_id: 'category_product_id_value',
//   sub_category_product_id: 'sub_category_product_id_value',
//   item_id: 'item_id_value',
//   maker_id: 'maker_id_value'
// }

const Grocery: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/groceries",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((grocery: any) => (
        <li className='p-4' key={grocery.id}>
          <p>ID: {grocery.id}</p>
          <p>Created at: {grocery.created_at}</p>
          <p>Updated at: {grocery.updated_at}</p>
          <p>Category Grocery ID: {grocery.category_grocery_id}</p>
          <p>Sub Category Grocery ID: {grocery.sub_category_grocery_id}</p>
          <p>Item ID: {grocery.item_id}</p>
          <p>Maker ID: {grocery.maker_id}</p>
          <Link href={`http://localhost:3000/api/v1/groceries/${grocery.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Grocery;