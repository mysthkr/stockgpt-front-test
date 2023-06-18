import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { getCookie } from "lib/getCookie";
import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, 
  ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState } from "react";
import useSWR from "swr";
import { Select, MenuItem,SelectChangeEvent } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Flex from "components/layout/Flex";
import toast, { Toaster } from "react-hot-toast";
import Layout from "components/templates/Layout";



const Request: NextPage = (props: any) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [text, setText] = useState("");
  const [requestType, setRequestType] = useState<number>(0);
  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  
  const handleRequestTypeChange = (e: SelectChangeEvent<number>) => {
    setRequestType(e.target.value as number);
  };

  const clickSubmit = async (e: any) => {
    e.preventDefault(); 
    const cookieData = getCookie();
    const userId = cookieData ? cookieData.userId : '';
    const groupId = cookieData ? cookieData.groupId : '';
    const axiosInstance = axios.create({
      baseURL: `http://localhost:3010/api/v1/`,
    });
      setIsError(false);
      setErrorMessage("");
      try {
        const response = await axiosInstance.post("requests", {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
          data: {request_type: requestType,request_name: text, user_id: userId}
        });
        toast.success("リクエストありがとうございます！");
        setText("");
        setRequestType(0);
      } catch (error: any) {
        setIsError(true);
        toast.error("リクエストできません！");
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0]) {
          setErrorMessage(error.response.data.errors[0]);
        } else {
          setErrorMessage("An error occurred");
        }
      }
  };

  return (
    <Layout>
      <Flex padding={2} justifyContent="center" backgroundColor="grayBack">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%" marginTop={10} marginBottom={10}>
          <Toaster />
            <Box>
              <form method="POST" onSubmit={clickSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <Select
                value={requestType}
                onChange={handleRequestTypeChange}
                sx={{ marginRight: "8px" }}
              >
                <MenuItem value={1}>リクエストタイプ1</MenuItem>
                <MenuItem value={2}>リクエストタイプ2</MenuItem>
                <MenuItem value={3}>リクエストタイプ3</MenuItem>
              </Select>
                <TextField
                  variant="outlined"
                  value={text}
                  onChange={changeText}
                  label="リクエスト名"
                  size="small"
                  sx={{ marginRight: '8px', flex: 1 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<UploadFileIcon />}
                  sx={{
                    backgroundColor: '#ff7f50',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#ff7f50',
                      transform: 'translateY(5px)',
                      boxShadow: 'none',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  リクエスト
                </Button>
              </form>
            </Box>
            </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Request;