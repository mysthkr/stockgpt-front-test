import * as React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "../lib/auth";
import Box from '../components/layout/Box'
import Flex from '../components/layout/Flex'
import Layout from '../components/templates/Layout'
import Link from 'next/link'
import { Card, CardContent, Typography } from "@mui/material";


export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("/api/v1/home");

const Home = () => {
  return (
    <Layout>
      <Flex padding={2} justifyContent="center">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width={{ base: '100%', md: '40%' }} textAlign={{ base: 'center', md: 'left' }}>
            <Typography variant="h2" sx={{ fontSize: '24px', mb: '16px' }}>
              StockGPT - 食品と日用品の在庫管理をサポートするアプリ
            </Typography>
            <Typography variant="body1" color="textSecondary">
              StockGPTは、食品や日用品の購入、活用、在庫管理をサポートするアプリです。もうすぐ期限が切れる日用品や食品を通知してくれます。買い物リストを作成し、買い忘れを防止します。
            </Typography>
          </Box>

          <Flex justifyContent="space-between" flexWrap="wrap" width={{ base: '100%', md: '60%' }}>
            <Card sx={{ width: '100%', mb: 4, flexBasis: { base: '100%', md: '48%' } }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  食品や日用品をストックで管理
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  食品や日用品の情報を管理し、編集や削除、検索ができます。
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: '100%', mb: 4, flexBasis: { base: '100%', md: '48%' } }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  購入リスト機能
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  利用期限が近い日用品を追加します。食品も追加できます。購入したかどうかをチェックし、カートに追加します。
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: '100%', mb: 4, flexBasis: { base: '100%', md: '48%' } }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  レシピの提案
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ストック内の食品からレシピを提案します。あなたのストックに合わせた美味しいレシピを見つけましょう。
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: '100%', mb: 4, flexBasis: { base: '100%', md: '48%' } }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  カート機能
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  購入リストの商品をカートに追加します。利用期限の目安を自動的に入力・編集します。スマートな買い物体験を実現します。
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: '100%', mb: 4, flexBasis: { base: '100%', md: '48%' } }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  在庫通知機能
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  もうすぐ期限が切れる食品や日用品を通知してくれます。無駄なくストックを管理しましょう。
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: '100%', mb: 4, flexBasis: { base: '100%', md: '48%' } }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  ログイン・新規登録
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  アカウントを作成または既存のアカウントでログインして、StockGPTを始めましょう。
                </Typography>
              </CardContent>
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Home;