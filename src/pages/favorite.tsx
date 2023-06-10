import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "../lib/auth";
import React from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("favorites");

const Favorite = (props: any) => {
  console.log(props);
  return (
    <div >
      {props.data.map((favorite: any) => (
        <li className='p-4' key={favorite.id}>
          <p>ID: {favorite.id}</p>
          <p>Created at: {favorite.created_at}</p>
          <p>Updated at: {favorite.updated_at}</p>
          <p>Group ID: {favorite.group_id}</p>
          <p>Item ID: {favorite.item_id}</p>
          <Link href={`http://localhost:3000/favorite/${favorite.id}`}>Show</Link>
        </li>
      ))}l
    </div>
  );
};

export default Favorite;