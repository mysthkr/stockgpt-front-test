import type { NextPage } from "next";
import Link from "next/link";
import { ReactNode, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState, SetStateAction, useEffect } from "react";
import useSWR, { useSWRConfig,Key, SWRResponse, mutate, Cache } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Alert, Skeleton, Tab, Tabs, TextField, Typography,Paper, styled, Button } from '@mui/material';
// import { TabPanel } from "@mui/lab";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie"
import { getCookie } from "lib/getCookie";
import React from "react";
import { AppProps } from 'next/app';
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardContent } from '@mui/material';
import { Head } from "next/document";
import { ShoppingCart } from "@mui/icons-material";


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

const CustomTypography = styled(Typography)`
  && {
    position: relative;
    cursor: pointer;
    &:after {      
      background-color: black;
      transform: scaleX(0);
      transition: transform 0.3s;
    }
    &.selected:after {
      transform: scaleX(1);
    } 
    &.selected {
      text-decoration: line-through;
    }
  }
`;

const ToBuyList: NextPage = () => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [text, setText] = useState('');
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/to_buy_lists`,
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ item_id: number, to_buy_list_id: number }[]>([]);

  const [value, setValue] = useState(0);

  
  console.log("data");
  console.log(data);
  // START HERE for fetchAllCriteriaData
  const fetchAllData = async () => {
    const cookieData = getCookie();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/criteria_days`,{
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "uid": cookieData?.uid || "",
        "client": cookieData?.client || "",
        "access-token": cookieData?.accessToken || "",
      },
    });
    const data = await response.json();
    return data;
  }

  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllData();
      setAllData(data);
    }
    fetchData();
  }, []);

  interface AllData {
    data: Array<{ item_id: number, criteria: number }>;
  }

  const displayItemData = (itemId: number) => {
    const allData: AllData = { data: [] };
    const itemData = allData.data?.find(data => data.item_id === itemId);
    if (itemData) {
      return itemData.criteria;
    } else {
      return null;
    }
  }
  // END HERE

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  const deleteClick = async (toBuyListId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/to_buy_lists/${toBuyListId}`, {
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
      toast.success("買い物リストから削除しました！");
      mutate(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/to_buy_lists`);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };

  interface AddCartButtonProps {
    className: string;
    selectedItems: any;
  }

  

  const AddCartButton: React.FC<AddCartButtonProps> = ({ className, selectedItems }) => {
    const [isLoading, setIsLoading] = useState(false);
  
    console.log("selectedItems");
    console.log(selectedItems);
    const addClick = async () => {
      setIsLoading(true);
      const cookieData = getCookie();
  
      for (const itemInfo of selectedItems) {
        try {
          const itemId = itemInfo.item_id
          const toBuyListId = itemInfo.to_buy_list_id
          const item = {
            criteria: Number(displayItemData(Number(itemId)) ? displayItemData(Number(itemId)) : 0),
            item_id: Number(itemId),
          };
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/carts`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              "uid": cookieData?.uid || "",
              "client": cookieData?.client || "",
              "access-token": cookieData?.accessToken || "",
            },
            body: JSON.stringify(item),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // この部分でレスポンスを処理します...
          const data = await response.json();
          toast.success("カートに追加しました！");
          deleteClick(toBuyListId);
        } catch (error) {
          console.error('An error occurred:', error);
          toast.error("カートに追加できません！");
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    return (
      <Button
        onClick={addClick}
        disabled={isLoading}
        sx={{
          color: '#ff7f50',
          '&:hover': {
            backgroundColor: '#fff7f1',
          },
          display: 'flex',
          alignItems: 'center',
        }}>
          <ShoppingCart />
        {isLoading ? 'Loading...' : '全チェックをカートに追加'}
      </Button>
    );
  };
  

  const handleItemClick = (itemId: number, toBuyListId: number) => {
    if (selectedItems.some((item) => item.to_buy_list_id === toBuyListId)) {
      setSelectedItems(selectedItems.filter((item) => item.to_buy_list_id !== toBuyListId));
    } else {
      setSelectedItems([...selectedItems, { item_id: itemId, to_buy_list_id: toBuyListId }]);
    }
  };
  
  return (
    <Layout {...data}>
      <Flex padding={2} justifyContent="center">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%">
          <Toaster />
          <AddCartButton
            className="text-white bg-indigo-500 border-0 py-2 px-8 
            focus:outline-none hover:bg-indigo-600 rounded text-lg"
            selectedItems={selectedItems}
          />
            {data.data.map((to_buy_list: any) => (
              <CustomTypography
                sx={{ fontFamily: 'Cinzel Decorative' }}
              >
                <li className='p-4' key={to_buy_list.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <CustomTypography variant="h5" className={selectedItems.some((item) => item.to_buy_list_id === to_buy_list.id)? 'selected' : ''}
                onClick={() => handleItemClick(to_buy_list.item_id, to_buy_list.id)}
                >
                  <span>{to_buy_list.item_name}</span>
                </CustomTypography>
                  <div>
                    {/* <Button color="primary">
                      詳細
                    </Button> */}
                    <Button variant="contained" color="error" onClick={() => deleteClick(to_buy_list.id)}>削除</Button>
                  </div>
                </li>
              </CustomTypography>
              ))}
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

ToBuyList.getInitialProps = async () => {
  return (
    // 特定のページでのみ使用するフォントのリンクやスタイルを追加
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative&display=swap" rel="stylesheet" />
      </Head>
  );
};


export default ToBuyList;