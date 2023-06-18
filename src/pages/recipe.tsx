import { getCookie } from "lib/getCookie";
import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { BounceLoader } from "react-spinners";
import { css } from "@emotion/react";
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import { Alert, IconButton, Paper, Skeleton, Tab, Tabs, TextField, Typography, 
  Grid, Card, CardContent, CardMedia, Button, Box, styled} from '@mui/material';

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

const Recipe: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/stock_items/recipes",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  return (
    <Layout {...data}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="center"
          style={{ padding: '2rem', minHeight: '80vh', backgroundColor: '#f4f4f4',
          }}
        >
          <Grid item xs={12} md={8}>
            {!data ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                <Typography variant="h6" gutterBottom>レシピを考えています...</Typography>
                <BounceLoader loading={true} color={"#ff7f50"} size={150} />
              </Box>
            ) : (
              <Paper elevation={3} sx={{ width: '100%', color: '#4B4B4B', marginTop: '2rem', 
              padding: '1rem' }} style={{
                boxShadow: '2px 8px 21px -2px #777777',
                borderRadius: '10px',
                width: '100%'
              }}>
                <Typography variant="body1" component="div">
                  {data.recipe.split('\n').map((line: string, index: number) => <>{line}<br /></>)}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
  
};

export default Recipe;