import type { NextPage } from "next";
import Link from "next/link";
import { ReactNode, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState, SetStateAction } from "react";
import useSWR, { useSWRConfig,Key, SWRResponse, mutate, Cache } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Alert, Skeleton, Tab, Tabs, TextField, Typography,Paper } from '@mui/material';
import { TabPanel } from "@mui/lab";
import { ItemDialog } from "components/organisms/ItemDialog";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
import Button from 'components/atoms/Button'
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie"
import { getCookie } from "lib/getCookie";
import React from "react";
import { AppProps } from 'next/app';
import toast, { Toaster } from 'react-hot-toast';

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

const Grocery: NextPage = () => {
  
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // checkCookie();
  const [text, setText] = useState('');
  const { data, error } = useSWR(
    `http://localhost:3010/api/v1/groceries`,
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push('/product');
  };

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;


  // const { data, error } = useSWR(
  //   `http://localhost:3010/api/v1/groceries/${text}`,
  //   fetcher
  // );

  // console.log(data);

  // const { mutate } = useSWRConfig()

  // const onSubmitHandler = (event: { preventDefault: () => void; }) => {
  //   event.preventDefault();
  //   console.log(text);
  // };

  interface AddCartButtonProps {
    className: string;
    // item: {criteria: number, price: number, item_id: number}
    item_id: number;
  }

  const AddCartButton: React.FC<AddCartButtonProps> = ({ className , item_id}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [criteriaInput, setCriteria] = useState('');
    const [priceInput, setPrice] = useState('');

    const addClick = async () => {
      setIsLoading(true);
      const cookieData = getCookie();
      try {
        const item = {
          criteria: Number(criteriaInput),
          price: Number(priceInput),
          item_id: Number(item_id),
        }
        const response = await fetch('http://localhost:3010/api/v1/carts', {
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
        setCriteria('');
        setPrice('');
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("カートに追加できません！");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Paper component="form">
        <TextField
          id="criteria"
          label="消費目安(日後)"
          name="criteria"
          value={criteriaInput}
          onChange={e => setCriteria(e.target.value)}
          autoComplete="criteria"
          autoFocus
        />
        <TextField
          name="price"
          label="値段"
          type="price"
          id="price"
          value={priceInput}
          onChange={e => setPrice(e.target.value)}
          autoComplete="price"
        />
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
        <Button color="black" onClick={addClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'カートに追加'}
        </Button>
      </Paper>
    );
  }


  //検索機能
  const changeText = (e: any) => {
    setText(e.target.value);
    // clickSubmit(e.target.value);
  }

  const clickSubmit = (e: any) => {
    console.log("送信されました");
    console.log(text);
    const cookieData = getCookie();
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
        .post("searches", {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
          data: text,
        })
        .then(function (response) {
          // Cookieにトークンをセットしています
          Cookies.set("uid", response.headers["uid"]);
          Cookies.set("client", response.headers["client"]);
          Cookies.set("access-token", response.headers["access-token"]);
          const data = response.data.json()
          console.log(data);
        })
        .catch(function (error) {
          // Cookieからトークンを削除しています
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
    })();
  }

  function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  // const addClick = async () => {
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch(`http://localhost:3010/api/v1/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         key1: 'value1',
  //         key2: 'value2',
  //         // etc...
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     // この部分でレスポンスを処理します...
  //     // const data = await response.json();
  //     // console.log(data);

  //   } catch (error) {
  //     console.error('An error occurred:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  
  
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
          <Toaster />
            

            <Box>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="食料品"  value={0} />
                <Tab label="日用品"  value={1} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              {/* <onClick={() => router.push('/grocery')}> */}
            </TabPanel>
            
            <TabPanel value={value} index={1}>
            
            </TabPanel>

            <Box width="100%">
              <Text>検索</Text>
              
              <form method="POST">
              {/* テキスト入力フォーム */}
              <input 
                className="border border-black" 
                type="text" 
                value={text}
                onChange={changeText}
              />
              {/* 追加ボタン */}
              <input
                type="submit"
                value="検索"
                onClick={clickSubmit}
              />
            </form>
            </Box>
            <div >
              {data.data.map((grocery: any) => (
                <li className='p-4' key={grocery.id}>
                  <p>ID: {grocery.id}</p>
                  <p>Created at: {grocery.created_at}</p>
                  <p>Updated at: {grocery.updated_at}</p>
                  <p>Category Grocery ID: {grocery.category_grocery_id}</p>
                  <p>Category Grocery Name: {grocery.category_grocery_name}</p>
                  <p>Sub Category Grocery ID: {grocery.sub_category_grocery_id}</p>
                  <p>Sub Category Grocery Name: {grocery.sub_category_grocery_name}</p>
                  <p>Item ID: {grocery.item_id}</p>
                  <p>Item Name: {grocery.item_name}</p>
                  <Link href={`http://localhost:3000/grocery/${grocery.id}`}>Show</Link>
                  <AddCartButton item_id={grocery.item_id}
                  className="text-white bg-indigo-500 border-0 py-2 px-8 
                  focus:outline-none hover:bg-indigo-600 rounded text-lg" />
                  


                </li>
              ))}
            </div>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Grocery;