import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Product: NextPage = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/makers`,
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((maker: any, index: number) => (
        <li className='p-4' key={maker.id}>
          <p>ID: {maker.id}</p>
          <p>Created at: {maker.created_at}</p>
          <p>Updated at: {maker.updated_at}</p>
          <p>name: {maker.name}</p>
          <Link href={`http://localhost:3000/maker/${maker.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Product;