import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Skeleton, Tab, Tabs, Typography } from '@mui/material';
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
            criteria: 100,
            price: 100,
            item_id: 1,
            // product_id: product.id,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // この部分でレスポンスを処理します...
        const data = await response.json();
        console.log(data);
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
                  <AddCartButton className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" item={{
                    criteria: 0,
                    price: 0,
                    item_id: 0
                  }} />
                  <GrFavorite />
                  <MdFavorite />
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