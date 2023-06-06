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

const Signup = () => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const axiosInstance = axios.create({
      baseURL: `http://localhost:3010/api/v1/`,
      headers: {
        "content-type": "application/json",
      },
    });
    (async () => {
      setIsError(false);
      setErrorMessage("");
      return await axiosInstance
        .post("groups", {
          name: "default_group_name",
        })
        .then(function (response) {
          // group_idを受け取ってセットしたい
          const group_id = response.data.id
          console.log(response.data);
          console.log(response.data.id);
          (async () => {
            setIsError(false);
            setErrorMessage("");
            return await axiosInstance
              .post("auth", {
                email: data.get("email"),
                password: data.get("password"),
                group_id: group_id,
              })
              .then(function (response) {
                // group_idを受け取ってセットしたい
                console.log(response.headers);
                console.log(response);
                Cookies.set("uid", response.headers["uid"]);
                Cookies.set("client", response.headers["client"]);
                Cookies.set("access-token", response.headers["access-token"]);
                router.push("/home");
              })
              .catch(function (error) {
                setIsError(true);
                setErrorMessage(error.response.data.errors[0]);
              });
          })();
        })
        .catch(function (error) {
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
    })();
    
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box>
        <Typography component="h1" variant="h5">
          サインイン
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
    </Container>
  );
};

export default Signup;