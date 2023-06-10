import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState, SetStateAction } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Skeleton, Tab, Tabs } from '@mui/material';
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

const fetcher = (url: string) => {
  const cookieData = getCookie();
  return fetch(url, {
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "uid": cookieData?.uid,
      "client": cookieData?.client,
      "access-token": cookieData?.accessToken,
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
    "http://localhost:3010/api/v1/groceries",
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  // console.log(data);

  // const { mutate } = useSWRConfig()

  // const onSubmitHandler = (event: { preventDefault: () => void; }) => {
  //   event.preventDefault();
  //   console.log(text);
  // };

  interface AddCartButtonProps {
    className: string;
    item: {criteria: number, price: number, item_id: number}
  }

  const AddCartButton: React.FC<AddCartButtonProps> = ({ className }) => {
    const [isLoading, setIsLoading] = useState(false);
    const addClick = async () => {
      setIsLoading(true);
      const cookieData = getCookie();
  
      try {
        const item = {criteria: 100,
          price: 100,
          item_id: 1,}

        const response = await fetch('http://localhost:3010/api/v1/carts', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
          body: JSON.stringify({
            criteria: item.criteria,
            price: item.price,
            item_id: item.item_id,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // この部分でレスポンスを処理します...
        const data = await response.json();
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Button color="black" onClick={addClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'カートに追加'}
      </Button>
    );
  }


  //検索機能
  const changeText = (e: any) => {
    setText(e.target.value);
    clickSubmit(e.target.value);
  }

  const clickSubmit = (e: any) => {
    console.log("送信されました");
    console.log(text);
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
          data: text,
        })
        .then(function (response) {
          // Cookieにトークンをセットしています
          Cookies.set("uid", response.headers["uid"]);
          Cookies.set("client", response.headers["client"]);
          Cookies.set("access-token", response.headers["access-token"]);
        })
        .catch(function (error) {
          // Cookieからトークンを削除しています
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
    })();
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
            <Box width="100%">
              <Link href="/grocery">
                <Text>食料品</Text>
              </Link>
              <Link href="/product">
                <Text>日用品</Text>
              </Link>
            </Box>
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
                  <AddCartButton item={criteria: 2, price: 3, item_id: 4} className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" />
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