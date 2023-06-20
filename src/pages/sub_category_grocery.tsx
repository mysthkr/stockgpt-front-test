import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("sub_category_groceries");

const SubCategoryGrocery = (props: any) => {
  return (
    <div >
      {props.data.map((sub_category_grocery: any) => (
        <li className='p-4' key={sub_category_grocery.id}>
          <p>ID: {sub_category_grocery.id}</p>
          <p>Created at: {sub_category_grocery.created_at}</p>
          <p>Updated at: {sub_category_grocery.updated_at}</p>
          <p>name: {sub_category_grocery.name}</p>
          <p>Maker ID: {sub_category_grocery.category_grocery_id}</p>
          <Link href={`${process.env.NEXT_PUBLIC_API_ROOT_URL}/sub_category_grocery/${sub_category_grocery.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default SubCategoryGrocery;