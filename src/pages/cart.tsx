import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("carts");

const Cart: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/carts",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((cart: any) => (
        <li className='p-4' key={cart.id}>
          <p>ID: {cart.id}</p>
          <p>Created at: {cart.created_at}</p>
          <p>Updated at: {cart.updated_at}</p>
          <p>Category Grocery ID: {cart.category_cart_id}</p>
          <p>Sub Category Grocery ID: {cart.sub_category_cart_id}</p>
          <p>Item ID: {cart.item_id}</p>
          <p>Maker ID: {cart.maker_id}</p>
          <Link href={`http://localhost:3000/cart/${cart.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Cart;