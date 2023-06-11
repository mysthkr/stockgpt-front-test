import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState, useEffect } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Alert, IconButton, Paper, Skeleton, Tab, Tabs, TextField, Typography } from '@mui/material';
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
import { GrFavorite } from "react-icons/gr";
import { MdFavorite } from "react-icons/md";
import toast from "react-hot-toast";

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

const Product: NextPage = () => {
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [favorite, setFavorite] = useState(false);

  const [text, setText] = useState('');
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/products",
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState(1);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push('/grocery');
  };

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  // useEffect(() => {
  //   getInitialFavorites();
  // }, []);

  interface AddCartButtonProps {
    className: string;
    // item: {criteria: number, price: number, item_id: number}
    item_id: number;
  }

  const AddCartButton: React.FC<AddCartButtonProps> = ({ className, item_id }) => {
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

  const handleAddFavorite = async (itemId: number) => {
    setIsLoading(true);
      const cookieData = getCookie();
      try {
        const response = await fetch('http://localhost:3010/api/v1/favorites', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
          body: JSON.stringify({ favorite: { item_id: itemId } }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // この部分でレスポンスを処理します...
        const data = await response.json();
        toast.success("お気に入りしました！");
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("お気に入りできません！");
      } finally {
        setIsLoading(false);
      }
    setFavorite(true);
  };

  const handleRemoveFavorite = async (productId: number) => {
    // ここでお気に入り削除のAPIリクエストを送信します。
    // APIリクエストが成功したら、setFavoriteを使ってステートを更新します。
    setIsLoading(true);
      const cookieData = getCookie();
      try {
        const response = await fetch(`http://localhost:3010/api/v1/favorites/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // この部分でレスポンスを処理します...
        const data = await response.json();
        toast.success("お気に入り解除しました！");
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("お気に入り解除できません！");
      } finally {
        setIsLoading(false);
      }
    setFavorite(true);
  };

  const getInitialFavorites = async ()=> {
    const cookieData = getCookie();
    const axiosInstance = axios.create({
      baseURL: `http://localhost:3010/api/v1/`,
    });
    (async () => {
      setIsError(false);
      setErrorMessage("");
      return await axiosInstance
        .get("favorites", {
          // credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
        })
        .then(function (response) {
          // Cookieにトークンをセットしています
          Cookies.set("uid", response.headers["uid"]);
          Cookies.set("client", response.headers["client"]);
          Cookies.set("access-token", response.headers["access-token"]);
          console.log("response");
          console.log(response);
          const data = response.data.json()
          console.log(data);
        })
        .catch(function (error) {
          // Cookieからトークンを削除しています
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
    })();
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
            

            <Box>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="食料品"  value={0} />
                <Tab label="日用品"  value={1} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              
            </TabPanel>
            
            <TabPanel value={value} index={1}>
            
            </TabPanel>

            <Box width="100%">
              <Text>検索</Text>
            </Box>

            <div >
              {data.data.map((product: any, index: number) => (
                <li className='p-4' key={product.id}>
                  <p>ID: {product.id}</p>
                  <p>Picture: {product.picture}</p>
                  <p>Created at: {product.created_at}</p>
                  <p>Updated at: {product.updated_at}</p>
                  <p>Category Product ID: {product.category_product_id}</p>
                  <p>Category Product Name: {product.category_product_name}</p>
                  <p>Sub Category Product ID: {product.sub_category_product_id}</p>
                  <p>Sub Category Product Name: {product.sub_category_product_name}</p>
                  <p>Item ID: {product.item_id}</p>
                  <p>Item Name: {product.item_name}</p>
                  <p>Maker ID: {product.maker_id}</p>
                  <p>Maker Name: {product.maker_name}</p>
                  <Link href={`http://localhost:3000/product/${product.id}`}>Show</Link>
                  <AddCartButton item_id={product.item_id} 
                    className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  />
                  {favorite ? (
                    <IconButton onClick={() => handleRemoveFavorite(product.item_id)}>
                      <MdFavorite />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleAddFavorite(product.item_id)}>
                      <GrFavorite />
                    </IconButton>
                  )}
                </li>
              ))}
            </div>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Product;