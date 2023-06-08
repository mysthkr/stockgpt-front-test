import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";

const fetcher = (url: string, uid: string, client: string, accessToken: string) => fetch(url, {
  credentials: 'include',
  headers: {
    "Content-Type": "application/json",
    // "uid": uid,
    // "client": client,
    // "access-token": accessToken,
    "uid": "testform@gmail.com"!,
    "client": "jYtoDrGC9IRHU03Zt5ZTbA"!,
    "access-token": "yy4Bs5wz2BLaX4i5E-HnTQ"!,
  },
}).then((res) => res.json());

// export const getServerSideProps: GetServerSideProps =
//   withAuthServerSideProps("carts");

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
          <p>criteria: {cart.criteria}</p>
          <p>price: {cart.price}</p>
          <p>group_id: {cart.group_id}</p>
          <p>item_id: {cart.item_id}</p>
          <p>Discarded at: {cart.discarded_at}</p>
          <Link href={`http://localhost:3000/cart/${cart.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Cart;