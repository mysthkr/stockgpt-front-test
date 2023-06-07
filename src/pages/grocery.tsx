import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Skeleton } from '@mui/material';
import { ItemDialog } from "components/organisms/ItemDialog";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'

const checkCookie = () => {
  if (typeof document !== 'undefined') {
    //クッキーに値をセット
    console.log(document.cookie);
    const arr: {[key: string]: string} = {};
    if(document.cookie != ''){
      var tmp = document.cookie.split('; ');
      for(var i=0;i<tmp.length;i++){
        var data = tmp[i].split('=');
        arr[data[0]] = decodeURIComponent(data[1]);
      }
    }
    const uid: string = arr['uid'];
    const client: string = arr['client'];
    const accessToken: string = arr['access-token'];
    console.log("============checkCookie============");
    console.log(client);
    console.log(uid);
    console.log(accessToken);
  }
}

const fetcher = (url: string, uid: string, client: string, accessToken: string) => fetch(url, {
  credentials: 'include',
  headers: {
    "Content-Type": "application/json",
    "uid": uid,
    "client": client,
    "access-token": accessToken,
  },
}).then((res) => res.json());

// export const getServerSideProps: GetServerSideProps =
//   withAuthServerSideProps("groceries");



const Grocery: NextPage = () => {
  checkCookie();
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/groceries",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  // console.log(data);

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
            <div >
              {data.data.map((grocery: any) => (
                <li className='p-4' key={grocery.id}>
                  <p>ID: {grocery.id}</p>
                  <p>Created at: {grocery.created_at}</p>
                  <p>Updated at: {grocery.updated_at}</p>
                  <p>Category Grocery ID: {grocery.category_grocery_id}</p>
                  <p>Sub Category Grocery ID: {grocery.sub_category_grocery_id}</p>
                  <p>Item ID: {grocery.item_id}</p>
                  <Link href={`http://localhost:3000/grocery/${grocery.id}`}>Show</Link>
                  <ItemDialog item={grocery} isOpen={false} onClose={function (): void {
                    throw new Error("Function not implemented.");
                  } } />
                </li>
              ))}
            </div>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Grocery;