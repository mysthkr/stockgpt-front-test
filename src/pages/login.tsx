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
      <Flex padding={2} justifyContent="center" alignItems="center" backgroundColor="grayBack">
        <Container component="main" maxWidth="xs">
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}  marginTop={5}>
            <Typography component="h1" variant="h5" sx={{textAlign: 'center'}}>
              ログイン
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{display: 'flex', justifyContent: 'center'}} marginTop={5}>
              <TextField
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <TextField
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Box>
              <Box marginTop={2} sx={{display: 'flex', justifyContent: 'center'}}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2, 
                    backgroundColor: '#ff7f50', 
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#e06d3d',
                    }
                  }}
                >
                  ログイン
                </Button>
              </Box>
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
  
            <Box marginTop={2} component="form" onSubmit={handleGuestSubmit} sx={{display: 'flex', justifyContent: 'center'}}>
              <Button
                type="submit"
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  backgroundColor: '#ff7f50', 
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#e06d3d',
                  }
                }}
              >
                ゲストログイン
              </Button>
            </Box>
          </Box>
        </Container>
      </Flex>
    </Layout>
  );
};

export default Login;