import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Button, Alert, Skeleton, Tab, Tabs, TextField, Typography,Paper } from '@mui/material';
import { getCookie } from "lib/getCookie";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
// import Button from 'components/atoms/Button'
import { parseISO, format, addDays } from 'date-fns'
import ja from 'date-fns/locale/ja'

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

const Cart: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/criteria_days",
    fetcher
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();


  // START HERE for fetchAllCriteriaData
  const fetchAllData = async () => {
    const cookieData = getCookie();
    const response = await fetch("http://localhost:3010/api/v1/criteria_days",{
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

  // interface AllData {
  //   data: Array<{ item_id: number, criteria: string }>;
  // }
  const [allData, setAllData] = useState({ data: [] });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllData();
      setAllData(data);
    }
    fetchData();
  }, []);

  const displayItemData = (itemId: number) => {
    // const allData: AllData = { data: [] };
    const itemData = allData.data.find(data => data.item_id === itemId);
    if (itemData) {
      console.log(itemData);
      return itemData.criteria;
    } else {
      return null;
    }
  }
  // END HERE

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;
  

  const deleteClick = async (cartId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`http://localhost:3010/api/v1/carts/${cartId}`, {
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
      toast.success("カートから削除しました！");
      mutate('http://localhost:3010/api/v1/carts');
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };

  interface AddStockButtonProps {
    className: string;
    item_id: number;
    cart_id: number;
  }

  const AddStockButton: React.FC<AddStockButtonProps> = ({ className , item_id, cart_id}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [criteriaInput, setCriteria] = useState(displayItemData(item_id) ? 
    displayItemData(item_id) : '');
    const [priceInput, setPrice] = useState('');
    const [quantityInput, setQuantity] = useState('');
    const date = new Date();
    const newDate = addDays(date, Number(criteriaInput));
    const [alarmDate, setAlarmDate] = useState(newDate);
    const [criteriaDate, setCriteriaDate] = useState(newDate);

    const stockClick = async () => {
      setIsLoading(true);
      const cookieData = getCookie();
      try {
        const item = {
          criteria: Number(criteriaInput),
          price: Number(priceInput),
          alarm_date: alarmDate.toISOString().split('T')[0], // 日付を 'YYYY-MM-DD' 形式に変換
          item_id: Number(item_id),
          quantity: Number(quantityInput),
        }
        const response = await fetch(`http://localhost:3010/api/v1/stock_items`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
          body: JSON.stringify(item),
        })
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // この部分でレスポンスを処理します...
        const data = await response.json();
        toast.success("ストックしました！");
        deleteClick(cart_id);
        mutate('http://localhost:3010/api/v1/stock_items');
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("ストックできません！");
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
          onChange={(e) => {
            const input = e.target.value;
            if (/^[0-9]*$/.test(input)) { // 入力が半角数字のみであることを確認
              setCriteria(input);
              setCriteriaDate(addDays(date, Number(input)));
              if (Number(input) === 1) { // 入力が1の場合のみ、1日を加算
                setAlarmDate(addDays(date, 1));
              } else {
                setAlarmDate(addDays(date, Number(input)-Math.ceil(Number(input)/10)));
              }
            } else {
              setErrorMessage("数字は半角で入力してください。");
              // toast.error("数字は半角で入力してください。");
              setIsError(true);
            }
          }}
          autoComplete="criteria"
        />
        <TextField
          name="price"
          label="値段"
          type="price"
          id="price"
          value={priceInput}
          onChange={(e) => {
            const input = e.target.value;
            if (/^[0-9]*$/.test(input)) { 
              setPrice(e.target.value)
            }
            else {
              setErrorMessage("数字は半角で入力してください。");
              // toast.error("数字は半角で入力してください。");
              setIsError(true);
            }
          }}
          autoComplete="price"
        />
        <TextField
          name="quantity"
          label="数量"
          type="quantity"
          id="quantity"
          value={quantityInput}
          onChange={(e) => {
            const input = e.target.value;
            if (/^[0-9]*$/.test(input)) { 
              setQuantity(e.target.value)
            }
            else {
              setErrorMessage("数字は半角で入力してください。");
              // toast.error("数字は半角で入力してください。");
              setIsError(true);
            }
          }}
          autoComplete="quantity"
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
        <Button color="success" onClick={stockClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'ストック'}
        </Button>
        <p>目安消費日： {format(criteriaDate, 'yyyy-MM-dd', {locale:ja})}</p>
        <p>アラーム設定日： {format(alarmDate, 'yyyy-MM-dd', {locale:ja})}</p>
      </Paper>
    );
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
          <Toaster />
            <div >
              {data.data.map((cart: any) => (
                <li className='p-4' key={cart.id}>
                  <p>ID: {cart.id}</p>
                  <p>Created at: {cart.created_at}</p>
                  <p>Updated at: {cart.updated_at}</p>
                  <p>criteria: {cart.criteria}</p>
                  <p>price: {cart.price}</p>
                  <p>group_id: {cart.group_id}</p>
                  <p>item_id: {cart.item_id}</p>
                  <p>Discarded at: {cart.discarded_at}</p>
                  <Link href={`http://localhost:3000/cart/${cart.id}`}>Show</Link>
                  <Button variant="contained" color="error" onClick={() => deleteClick(cart.id)}>delete</Button>
                  
                  <AddStockButton item_id={cart.item_id} cart_id={cart.id}
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

export default Cart;
