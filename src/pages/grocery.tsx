import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Skeleton } from '@mui/material';

const fetcher = (url: string) => fetch(url, {
  credentials: 'include',headers: {
    "Content-Type": "application/json"
  },
}).then((res) => res.json());

// export const getServerSideProps: GetServerSideProps =
//   withAuthServerSideProps("groceries");

const Grocery: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/groceries",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  // console.log(data);

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
          <Link href={`http://localhost:3000/grocery/${grocery.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Grocery;