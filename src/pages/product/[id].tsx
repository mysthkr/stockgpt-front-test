import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router from 'next/router';
import { withAuthFetch } from "lib/auth";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'

// const fetcher = (url: string) => fetch(url).then((res) => res.json());
export async function getServerSideProps(context: { query?: any; req?: any; res?: any; }) {
  const { req, res } = context;
  const { id } = context.query;
  console.log(req);

  const response = await withAuthFetch(`groceries/${id}`, req.cookies);
  console.log(response.headers);
  if (!response.ok && response.status === 401) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // TODO: 他にも500エラーを考慮した分岐も必要
  const props = await response.json();
  return { props };
};

const Product = (props: any) => {
  return (
    <Layout {...props}>
      <Flex padding={2} justifyContent="center" backgroundColor="grayBack">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%">
          <li className='p-4'>
            <p>ID: {props.id}</p>
            <p>Created at: {props.created_at}</p>
            <p>Updated at: {props.updated_at}</p>
            <p>Category Product ID: {props.category_grocery_id}</p>
            <p>Sub Category Product ID: {props.sub_category_grocery_id}</p>
            <p>Item ID: {props.item_id}</p>
            <p>Maker ID: {props.maker_id}</p>
            <Link href={`http://localhost:3000/product`}>Show</Link>
          </li>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Product;