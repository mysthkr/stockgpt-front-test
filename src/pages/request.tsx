import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Product: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/requests",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((request: any, index: number) => (
        <li className='p-4' key={request.id}>
          <p>ID: {request.id}</p>
          <p>Created at: {request.created_at}</p>
          <p>Updated at: {request.updated_at}</p>
          <p>request_type: {request.request_type}</p>
          <p>request_name: {request.request_name}</p>
          <p>register_flag: {request.register_flag}</p>
          <p>user_id: {request.user_id}</p>
          <Link href={`http://localhost:3000/request/${request.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Product;