import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Skeleton, Tab, Tabs } from '@mui/material';
import { TabPanel } from "@mui/lab";
import { ItemDialog } from "components/organisms/ItemDialog";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'

const fetcher = (url: string, uid: string, client: string, accessToken: string) => fetch(url, {
  credentials: 'include',
  headers: {
    "Content-Type": "application/json",
    "uid": uid,
    "client": client,
    "access-token": accessToken,
  },
}).then((res) => res.json());

const Product: NextPage = () => {

  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/products",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

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
            <Box width="100%">
              <Link href="/grocery">
                <Text>食料品</Text>
              </Link>
              <Link href="/product">
                <Text>日用品</Text>
              </Link>
            </Box>
            <Box width="100%">
              <Text>検索</Text>
            </Box>

            <div >
              {data.data.map((product: any, index: number) => (
                <li className='p-4' key={product.id}>
                  <p>ID: {product.id}</p>
                  <p>Picture: {product.picture}</p>
                  <p>Created at: {product.created_at}</p>
                  <p>Updated at: {product.updated_at}</p>
                  <p>Category Product ID: {product.category_product_id}</p>
                  <p>Sub Category Product ID: {product.sub_category_product_id}</p>
                  <p>Item ID: {product.item_id}</p>
                  <p>Maker ID: {product.maker_id}</p>
                  <Link href={`http://localhost:3000/product/${product.id}`}>Show</Link>
                </li>
              ))}
            </div>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Product;