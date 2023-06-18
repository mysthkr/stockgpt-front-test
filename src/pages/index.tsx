import * as React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "../lib/auth";
import Box from '../components/layout/Box'
import Flex from '../components/layout/Flex'
import Layout from '../components/templates/Layout'
import Link from 'next/link'


export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("/api/v1/home");

const Home = () => {
  return (
    <Layout>
    <Flex padding={2} justifyContent="center" backgroundColor="grayBack">
      <Flex
        width={{ base: '100%', md: '1040px' }}
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box width="100%">
        <p>home</p>
        </Box>
      </Flex>
    </Flex>
  </Layout>
  );
};

export default Home;