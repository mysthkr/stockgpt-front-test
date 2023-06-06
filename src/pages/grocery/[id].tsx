import type { NextPage } from "next";
import Link from "next/link";
import React, { useReducer, useState } from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router from 'next/router';
import { withAuthServerSideProps } from "lib/auth";
import { GetServerSideProps } from "next";
import Text from 'components/atoms/Text'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps(`groceries`);

// export async function getServerSideProps({ query })  {
//   withAuthServerSideProps(`grocery/${query.id}`);
//   return {
//     props: {},
//   };
// };

// const [state, setState] = useState({
//   isOpenOrderDialog: false,
//   selectedGrocery: null
// })

// const clickFoodItem = (grocery) => {
//   setState({
//     isOpenOrderDialog: true,
//     selectedGrocery: grocery,
//   })
// }



interface LayoutGroceryProps {
  id: number;
  category_grocery_id: number;
  sub_category_grocery_id: number;
  item_id: number;
  maker_id: number;
}


const Grocery = (props: any) => {
  console.log(props)
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
            <p>Category Grocery ID: {props.category_grocery_id}</p>
            <p>Sub Category Grocery ID: {props.sub_category_grocery_id}</p>
            <p>Item ID: {props.item_id}</p>
            <Link href={`http://localhost:3000/grocery`}>Show</Link>
          </li>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Grocery;