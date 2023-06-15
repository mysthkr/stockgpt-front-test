import type { NextPage } from "next";
import Link from "next/link";
import React, { useReducer, useState } from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router from 'next/router';
import { withAuthServerSideProps, withAuthFetch } from "../../lib/auth";
import { GetServerSideProps } from "next";
import Text from '../../components/atoms/Text'
import Box from '../../components/layout/Box'
import Flex from '../../components/layout/Flex'
import Layout from '../../components/templates/Layout'
import { getCookie } from "lib/getCookie";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());


// export const getServerSideProps: GetServerSideProps =
//   withAuthServerSideProps(`profiles`);

export async function getServerSideProps(context: { query?: any; req?: any; res?: any; }) {
  const { req, res } = context;
  const { id } = context.query;

  const response = await withAuthFetch(`profiles/${id}`, req.cookies);
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
  // const props = await response.json();
  const data = await response.json();
  if (Array.isArray(data)) {
    return { props: { data: data } };
  }
  return { props: { data } };
};


const Profile = (props: any, id: number) => {
  const cookieData = getCookie();
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
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
            <p>ID: {props.data[0].id}</p>
            <p>Created at: {props.data[0].created_at}</p>
            <p>Updated at: {props.data[0].updated_at}</p>
            <p>user ID: {props.data[0].user_id}</p>
            <p>Name: {props.data[0].name}</p>
            <p>Nickname: {props.data[0].nickname}</p>
            <Link href={`http://localhost:3000/profile/${userId}/edit`}>編集</Link>
            <Link href={`http://localhost:3000/user/${id}`}>ユーザー削除</Link>
          </li>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Profile;