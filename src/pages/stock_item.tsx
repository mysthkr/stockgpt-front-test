import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Button, Grid, Switch } from "@mui/material";
import IOSSwitch from "components/atoms/IosSwitch";
import { getCookie } from "lib/getCookie";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
// import Button from 'components/atoms/Button'

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

const StockItem: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/stock_items",
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);
  console.log(data);
  const { mutate } = useSWRConfig();
  const [sortedData, setSortedData] = useState([]);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    if (data) {
      setSortedData(data.data);
    }
  }, [data]);
  

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSorted(event.target.checked);
    if (event.target.checked) {
      const sorted = [...sortedData].sort((a, b) => ((a.alarm_date < b.alarm_date) ? -1 : 1));
      setSortedData(sorted);
    } else {
      // Switchがオフの時は元のデータをセットします
      setSortedData(data.data);
    }
  };

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  const deleteClick = async (stockItemId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`http://localhost:3010/api/v1/stock_items/${stockItemId}`, {
        method: 'DELETE',
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
      // この部分でレスポンスを処理します...
      const data = await response.json();
      toast.success("ストックから削除しました！");
      mutate('http://localhost:3010/api/v1/stock_items');
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Layout {...data}>
      <Flex padding={2} justifyContent="center" backgroundColor="grayBack">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>登録順</Grid>
            <Grid item>
              <IOSSwitch
                checked={isSorted}
                onChange={handleSortChange}
                inputProps={{ 'aria-label': 'Sort items' }}
              />
            </Grid>
            <Grid item>アラーム日順</Grid>
          </Grid>
          <Toaster />
            <div >
              {sortedData.map((stock_item: any) => (
                <li className='p-4' key={stock_item.id}>
                  <p>ID: {stock_item.id}</p>
                  <p>Created at: {stock_item.created_at}</p>
                  <p>Updated at: {stock_item.updated_at}</p>
                  <p>criteria: {stock_item.criteria}</p>
                  <p>price: {stock_item.price}</p>
                  <p>group_id: {stock_item.group_id}</p>
                  <p>item_id: {stock_item.item_id}</p>
                  <p>Discarded at: {stock_item.discarded_at}</p>
                  <p>Alarm_date at: {stock_item.alarm_date}</p>
                  <p>quantity: {stock_item.quantity}</p>
                  <Link href={`http://localhost:3000/stock_item/${stock_item.id}`}>Show</Link>
                  <Button variant="contained" color="error" onClick={() => deleteClick(stock_item.id)}>delete</Button>
                  
                </li>
              ))}
            </div>
            </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default StockItem;
