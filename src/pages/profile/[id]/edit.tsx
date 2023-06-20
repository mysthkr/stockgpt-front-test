import type { NextPage } from "next";
import Link from "next/link";
import React, { FormEvent, useReducer, useState } from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router, { useRouter } from 'next/router';
import { withAuthServerSideProps } from "../../../lib/auth";
import { GetServerSideProps } from "next";
import Text from '../../../components/atoms/Text'
import Flex from '../../../components/layout/Flex'
import Layout from '../../../components/templates/Layout'
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material/"
import axios from "axios"
import Cookies from "js-cookie"

// const fetcher = (url: string) => fetch(url).then((res) => res.json());


// export const getServerSideProps: GetServerSideProps =
//   withAuthServerSideProps(`profiles/1`);

const ProfileEdit = () => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const axiosInstance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/`,
      headers: {
        "content-type": "application/json",
      },
    });
    (async () => {
      setIsError(false);
      setErrorMessage("");
      return await axiosInstance
        .post("profiles", {
          name: data.get("name"),
          nickname: data.get("nickname"),
        })
        .then(function (response) {
          router.push("/profile/1");
        })
        .catch(function (error) {
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
      })();
  }

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
            <Typography component="h1" variant="h5">
              プロフィール編集
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                id="name"
                label="名前"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                id="nickname"
                label="ニックネーム"
                name="nickname"
                autoComplete="nickname"
                autoFocus
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                新規登録
              </Button>
              {isError ? (
                <Alert
                  onClose={() => {
                    setIsError(false);
                    setErrorMessage("");
                  }}
                  severity="error"
                >
                  {errorMessage}
                </Alert>
              ) : null}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ProfileEdit;


