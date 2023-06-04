import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("category_groceries");

const CategoryGrocery = (props: any) => {
  return (
    <div >
      {props.data.map((category_grocery: any) => (
        <li className='p-4' key={category_grocery.id}>
          <p>ID: {category_grocery.id}</p>
          <p>Created at: {category_grocery.created_at}</p>
          <p>Updated at: {category_grocery.updated_at}</p>
          <p>Name: {category_grocery.name}</p>
          <Link href={`http://localhost:3000/category_grocery/${category_grocery.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default CategoryGrocery;