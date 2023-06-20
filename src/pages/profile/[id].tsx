import type { NextPage } from "next";
import Link from "next/link";
import React, { useReducer, useState } from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import router, { useRouter } from 'next/router';
import { withAuthServerSideProps, withAuthFetch } from "../../lib/auth";
import { GetServerSideProps } from "next";
import Text from '../../components/atoms/Text'
import Box from '../../components/layout/Box'
import Flex from '../../components/layout/Flex'
import Layout from '../../components/templates/Layout'
import { getCookie } from "lib/getCookie";
import { Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Person, Delete, Message } from '@mui/icons-material';
import toast from "react-hot-toast";

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


const RequestNavLink = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link href="/request" passHref>
        <Badge
          color="secondary"
          overlap="circular"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        <Box display="flex" alignItems="center">
          <Message
            style={{
              color: isHovered ? "#ff7f50" : "#4B4B4B",
              fontSize: 32,
            }}
          />
          <span style={{ fontSize: 16,
            color: isHovered ? "#ff7f50" : "#4B4B4B",
            }}>リクエスト</span>
          </Box>
        </Badge>
    </Link>
  );
};


const Profile = (props: any, id: number) => {
  const cookieData = getCookie();
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };


  const handleDeleteUser = async () => {
    setIsLoading(true);
    const cookieData = getCookie();
    // 退会処理を行うAPIエンドポイントのURLを設定してください
    const url = `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/users/${userId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          "uid": cookieData?.uid || "",
          "client": cookieData?.client || "",
          "access-token": cookieData?.accessToken || "",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      toast.success("ユーザーを削除しました！");
      router.push(`/`);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout {...props}>
      <Flex padding={2} justifyContent="center">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%" marginTop="10px">
            <Flex alignItems="center" justifyContent="center">
              <Person style={{ color: "#4B4B4B" }} />
              <Typography style={{ color: "#4B4B4B", marginLeft: "0.5rem" }}>プロフィール</Typography>
            </Flex>
            <p>お名前: {props.data[0].name}</p>
            <p>メールアドレス: {props.data[0].email}</p>
            <p>ニックネーム: {props.data[0].nickname}</p>
            <p>同居人数: {props.data[0].roommate_number}人</p>
            <p>在住県: {props.data[0].prefecture}</p>
            <p>グループ名: {props.data[0].group_name}</p>
            <Link href={`${process.env.NEXT_PUBLIC_API_ROOT_URL}/profile/${userId}/edit`}>プロフィール編集</Link>
            <Button onClick={handleOpenDialog} variant="contained" startIcon={<Delete />}>
              退会
            </Button>
            <Link href={`${process.env.NEXT_PUBLIC_API_ROOT_URL}/group/${groupId}`}>グループ</Link>
            <RequestNavLink />
          </Box>
        </Flex>
      </Flex>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>退会</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "#4B4B4B" }}>
            本当に退会しますか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            キャンセル
          </Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            退会する
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Profile;