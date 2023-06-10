import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Button } from "@mui/material";
import { getCookie } from "lib/getCookie";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
// import Button from 'components/atoms/Button'

const fetcher = (url: string, uid: string, client: string, accessToken: string) => fetch(url, {
  credentials: 'include',
  headers: {
    "Content-Type": "application/json",
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
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);
  const deleteClick = async (cartId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`http://localhost:3010/api/v1/carts/${cartId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          "uid": cookieData?.uid || "",
          "client": cookieData?.client || "",
          "access-token": cookieData?.accessToken || "",
        },
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // この部分でレスポンスを処理します...
      const data = await response.json();
      toast.success("カートから削除しました！");
      mutate('http://localhost:3010/api/v1/carts');
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout {...data}>
      <Flex padding={2} justifyContent="center" backgroundColor="grayBack">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%">
          <Toaster />
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
                  <Button variant="contained" color="error" onClick={() => deleteClick(cart.id)}>delete</Button>
                </li>
              ))}
            </div>
            </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Cart;
