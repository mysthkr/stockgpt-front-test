import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router from 'next/router';
import { withAuthServerSideProps } from "lib/auth";
import { GetServerSideProps } from "next";

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps(`groceries`);

// export async function getServerSideProps({ query })  {
//   withAuthServerSideProps(`grocery/${query.id}`);
//   return {
//     props: {},
//   };
// };

const Grocery = (props: any) => {
  return (
    <div >
      console.log(props)
      {props.data((grocery: any) => (
        <li className='p-4' key={grocery.id}>
          <p>ID: {grocery.id}</p>
          <p>Created at: {grocery.created_at}</p>
          <p>Updated at: {grocery.updated_at}</p>
          <p>Category Grocery ID: {grocery.category_grocery_id}</p>
          <p>Sub Category Grocery ID: {grocery.sub_category_grocery_id}</p>
          <p>Item ID: {grocery.item_id}</p>
          <p>Maker ID: {grocery.maker_id}</p>
          <Link href={`http://localhost:3000/api/v1/grocert`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Grocery;