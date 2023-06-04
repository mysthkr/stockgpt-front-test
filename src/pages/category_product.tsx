import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("category_products");

const CategoryProduct: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/category_products",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((category_product: any) => (
        <li className='p-4' key={category_product.id}>
          <p>ID: {category_product.id}</p>
          <p>Created at: {category_product.created_at}</p>
          <p>Updated at: {category_product.updated_at}</p>
          <p>Name: {category_product.name}</p>
          <Link href={`http://localhost:3000/category_product/${category_product.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default CategoryProduct;