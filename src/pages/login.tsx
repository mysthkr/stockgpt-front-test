import React, { ReactElement, useState } from "react";
import { useRouter } from "next/router";
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
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import { Toaster, toast } from "react-hot-toast";
import { getCookie } from "lib/getCookie";

// console.log(useUserContext());

const Login = () => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const cookieData = getCookie();
  if  ((cookieData?.uid && cookieData?.uid !== "undefined" )&&
      (cookieData?.client  && cookieData?.client !=="undefined" )&&
      (cookieData?.accessToken && cookieData?.accessToken !=="undefined" )) {
        toast.success("既にログインしています！");
        toast.success("ホーム画面に遷移します！");
        router.push("/");
  }

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
        .post("auth/sign_in", {
          email: data.get("email"),
          password: data.get("password"),
        })
        .then(function (response) {
          // Cookieにトークンをセットしています
          console.log(response.headers);
          console.log(response);
          Cookies.set("uid", response.headers["uid"]);
          Cookies.set("client", response.headers["client"]);
          Cookies.set("access-token", response.headers["access-token"]);
          Cookies.set("id", response.data.data["id"]);
          Cookies.set("group_id", response.data.data["group_id"]);
          toast.success("ログインしました！");
          toast.success("ホーム画面に遷移します！");
          router.push("/");
        })
        .catch(function (error) {
          // Cookieからトークンを削除しています
          Cookies.remove("uid");
          Cookies.remove("client");
          Cookies.remove("access-token");
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
    })();
  };


    const handleGuestSubmit = (event: any) => {
      event.preventDefault();
      // const data = new FormData(event.currentTarget);
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
          .post("auth/sign_in", {
            email: "testform2@gmail.com",
            password: "testform2",
          })
          .then(function (response) {
            // Cookieにトークンをセットしています
            console.log(response.headers);
            console.log(response);
            Cookies.set("uid", response.headers["uid"]);
            Cookies.set("client", response.headers["client"]);
            Cookies.set("access-token", response.headers["access-token"]);
            Cookies.set("id", response.data.data["id"]);
            Cookies.set("group_id", response.data.data["group_id"]);
            router.push("/");
          })
          .catch(function (error) {
            // Cookieからトークンを削除しています
            Cookies.remove("uid");
            Cookies.remove("client");
            Cookies.remove("access-token");
            setIsError(true);
            setErrorMessage(error.response.data.errors[0]);
          });
      })();
  };

  return (
    <Layout>
      <Toaster />
    <Flex padding={2} justifyContent="center" backgroundColor="grayBack">
      <Flex
        width={{ base: '100%', md: '1040px' }}
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box width="100%">
        
        
    <Container component="main" maxWidth="xs">
      <Box>
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
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

        <Box component="form" onSubmit={handleGuestSubmit}>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ゲストログイン
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
    </Container>

    </Box>
      </Flex>
    </Flex>
  </Layout>
  );
};

export default Login;