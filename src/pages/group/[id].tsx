import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router from 'next/router';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Grocery: NextPage = () => {
  const { data, error } = useSWR(
    `http://localhost:3010/api/v1/groups/${router.query.id}`,
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((group: any) => (
        <li className='p-4' key={group.id}>
          <p>ID: {group.id}</p>
          <p>Created at: {group.created_at}</p>
          <p>Updated at: {group.updated_at}</p>
          <p>Category Grocery ID: {group.category_group_id}</p>
          <p>Sub Category Grocery ID: {group.sub_category_group_id}</p>
          <p>Item ID: {group.item_id}</p>
          <p>Maker ID: {group.maker_id}</p>
          <Link href={`http://localhost:3000/group/${group.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Grocery;