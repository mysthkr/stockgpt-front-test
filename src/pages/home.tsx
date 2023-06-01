import * as React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "../lib/auth";

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("/api/v1/home");

const Home = () => {
  return (
    <>
      <div>
        <main>
          <h1>HOME</h1>
          <p>ホーム画面です</p>
        </main>
      </div>
    </>
  );
};

export default Home;