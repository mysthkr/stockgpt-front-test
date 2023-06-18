import type { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR, { mutate } from "swr";
import router from 'next/router';
import { withAuthFetch } from "lib/auth";
import { getCookie } from "lib/getCookie";
// import Box from '../../components/layout/Box'
import Flex from '../../components/layout/Flex'
import Layout from '../../components/templates/Layout'
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography, List, ListItem, ListItemText, IconButton,
        Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Skeleton, ThemeProvider, Badge } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import MessageIcon from '@mui/icons-material/Message';
import { theme } from "themes";
import { Message } from "@mui/icons-material";

const fetcher = (url: string) => {
  const cookieData = getCookie();
  return fetch(url, {
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "uid": cookieData?.uid || "",
      "client": cookieData?.client || "",
      "access-token": cookieData?.accessToken || "",
    },
  }).then((res) => res.json())
};


export async function getServerSideProps(context: { query?: any; req?: any; res?: any; }) {
  const { req, res } = context;
  const { id } = context.query;

  const response = await withAuthFetch(`groups/${id}`, req.cookies);
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
  console.log(data);
  if (Array.isArray(data)) {
    return { props: { data: data } };
  }
  return { props: { data } };
};

const Group= (props: any, id: number) => {
  const cookieData = getCookie();
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
  const [isLoading, setIsLoading] = useState(false);
  console.log(props);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  const { data: invitations, error } = useSWR(
    "http://localhost:3010/api/v1/invitations",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!invitations) return <Skeleton>Loading...</Skeleton>;

  const renderData = invitations && (
    <Typography variant="h6" gutterBottom sx={{ color: '#4B4B4B', paddingLeft: '1rem' }}>
        招待状:
        <Typography component="span" sx={{ color: '#4B4B4B' }}>
          <List sx={{ paddingLeft: '1rem' }}>
            {invitations.map((invitation: any, index: any) => (
              <ListItem key={index}>
                <ListItemText
                  primaryTypographyProps={{ sx: { textAlign: 'center' } }}
                />
                  {invitation.group_name} からの招待
              <Button
                onClick={() => handleApproveInvitation(invitation.id)}
                variant="contained"
                color="primary"
              >
                承認する
              </Button>
              </ListItem>
            ))}
          </List>
        </Typography>
      </Typography>
  );

  console.log(invitations);

  const handleDeleteUserInGroup = async (userId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`http://localhost:3010/api/v1/users/change_group`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          "uid": cookieData?.uid || "",
          "client": cookieData?.client || "",
          "access-token": cookieData?.accessToken || "",
        },
        body: JSON.stringify({user_id: userId, group_id: groupId})
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // この部分でレスポンスを処理します...
      const data = await response.json();
      toast.success("グループから削除しました！");
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleInvite = async () => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`http://localhost:3010/api/v1/invitations`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          "uid": cookieData?.uid || "",
          "client": cookieData?.client || "",
          "access-token": cookieData?.accessToken || "",
        },
        body: JSON.stringify({email: email, group_id: groupId, user_id: userId})
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // この部分でレスポンスを処理します...
      const data = await response.json();
      toast.success("招待状を送りました！");
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("招待できません！");
    } finally {
      setIsLoading(false);
    }


    setOpen(false);
  };

  const handleApproveInvitation = async (invitationId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`http://localhost:3010/api/v1/users/approve_group`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          "uid": cookieData?.uid || "",
          "client": cookieData?.client || "",
          "access-token": cookieData?.accessToken || "",
        },
        body: JSON.stringify({ group_id: groupId, user_id: userId, invitation_id: invitationId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ユーザーのgroup_id情報を更新する場合の処理を追加

      toast.success("招待を承認しました！");
      router.push('/');
      mutate('http://localhost:3010/api/v1/invitations');
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("招待を承認できません！");
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
      <Box width="100%">
        <Toaster />
        <Typography variant="h6" gutterBottom sx={{ color: '#4B4B4B', paddingLeft: '1rem' }}>
          グループ名:    
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: '#4B4B4B', textAlign: 'center' }}>
          {props.data.group.name}
        </Typography>  
        <Typography variant="h6" gutterBottom sx={{ color: '#4B4B4B', paddingLeft: '1rem' }}>
          グループメンバー:
          <Typography component="span" sx={{ color: '#4B4B4B' }}>
          <List sx={{ paddingLeft: '1rem' }}>
            {props.data.user_data.map((user: any, index: any) => (
              <ListItem key={index}>
                <ListItemText
                  primary={user.name}
                  primaryTypographyProps={{ sx: { textAlign: 'center' } }}
                />
                <IconButton
                  onClick={() => handleDeleteUserInGroup(user.id)}
                  aria-label="削除"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Typography>
      </Typography>
      {renderData}
  <Box sx={{ paddingLeft: '1rem', marginTop: '1rem' }}>
    <Link href={`http://localhost:3000/profile/${userId}/edit`}>
      プロフィール編集
    </Link>
    <Button onClick={handleOpenDialog}>グループ招待</Button>
    
  </Box>
</Box>
        </Flex>
      </Flex>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>グループ招待</DialogTitle>
        <DialogContent>
          <TextField
            label="メールアドレス"
            value={email}
            onChange={handleEmailChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button onClick={handleInvite} variant="contained" color="primary">
            招待する
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Group;