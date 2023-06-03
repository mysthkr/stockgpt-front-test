import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("sub_category_groceries");

const CategoryGrocery = (props: any) => {
  return (
    <div >
      {props.data.map((sub_category_grocery: any) => (
        <li className='p-4' key={sub_category_grocery.id}>
          <p>ID: {sub_category_grocery.id}</p>
          <p>Created at: {sub_category_grocery.created_at}</p>
          <p>Updated at: {sub_category_grocery.updated_at}</p>
          <p>Category Grocery ID: {sub_category_grocery.category_sub_category_grocery_id}</p>
          <p>Sub Category Grocery ID: {sub_category_grocery.sub_category_sub_category_grocery_id}</p>
          <p>Item ID: {sub_category_grocery.item_id}</p>
          <p>Maker ID: {sub_category_grocery.maker_id}</p>
          <Link href={`http://localhost:3000/sub_category_grocery/${sub_category_grocery.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default CategoryGrocery;