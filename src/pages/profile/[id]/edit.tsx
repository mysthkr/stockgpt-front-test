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
import { getCookie } from "lib/getCookie";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());


// export const getServerSideProps: GetServerSideProps =
//   withAuthServerSideProps(`profiles/1`);

const ProfileEdit = () => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const cookieData = getCookie();
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
  const client = cookieData ? cookieData.client : '';
  
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const axiosInstance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/`,
      headers: {
        "content-type": "application/json",
        "uid": cookieData?.uid || "",
        "client": cookieData?.client || "",
        "access-token": cookieData?.accessToken || "",
      },
    });
    (async () => {
      setIsError(false);
      setErrorMessage("");
      const profile = {
        ...(data.get("name") && { name: data.get("name") }),
        ...(data.get("nickname") && { nickname: data.get("nickname") }),
      };
      return await axiosInstance
        .patch(`profiles/${userId}`, {
          profile
        })
        .then(function (response) {
          router.push(`/profile/${userId}`);
        })
        .catch(function (error) {
          setIsError(true);
          setErrorMessage("エラーが発生しました。");
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
          <Box width="100%" paddingTop={5}>
          <Flex alignItems="center" justifyContent="center">
            <Typography component="h1" variant="h5">
              プロフィール編集
            </Typography>
            </Flex>
            <Box component="form" onSubmit={handleSubmit} marginTop={5}>
            <Flex alignItems="center" justifyContent="center">
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
            </Flex>
            <Flex alignItems="center" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2,backgroundColor: '#ff7f50' }}
              >
                編集
              </Button>
              </Flex>
              <Flex alignItems="center" justifyContent="center">
              {isError ? (
                <Alert
                  onClose={() => {
                    setIsError(false);
                    setErrorMessage("エラーが発生しました。");
                  }}
                  severity="error"
                >
                  {errorMessage}
                </Alert>
              ) : null}
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ProfileEdit;


