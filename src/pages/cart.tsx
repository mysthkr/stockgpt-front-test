import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Button, Alert, Skeleton, Tab, Tabs, TextField, Typography,Paper, 
  Grid, CardMedia, CardContent,Box, Card, Checkbox, FormControlLabel } from '@mui/material';
import { getCookie } from "lib/getCookie";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
// import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
// import Button from 'components/atoms/Button'
import { parseISO, format, addDays } from 'date-fns'
import ja from 'date-fns/locale/ja'
import { Inventory, Person, ShoppingCart,CheckCircle } from '@mui/icons-material';
import { FaIndustry, FaShoppingCart } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";

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
    "http://localhost:3010/api/v1/carts",
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
    const itemData = allData.data.find((data: any) => data.item_id === itemId);
    if (itemData) {
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
    cart_criteria: number;
    cart_price: number;
  }

  const AddStockButton: React.FC<AddStockButtonProps> = ({ className , item_id, cart_id, cart_criteria, cart_price}) => {
    const [isLoading, setIsLoading] = useState(false);
    console.log("cart_criteria");
    console.log(cart_criteria);
    const [criteriaInput, setCriteria] = useState(displayItemData(item_id) ? 
    cart_criteria || displayItemData(item_id) : '');
    const [priceInput, setPrice] = useState('');
    const [quantityInput, setQuantity] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const date = new Date();
    const newDate = addDays(date, Number(criteriaInput));
    const [alarmDate, setAlarmDate] = useState(displayItemData(item_id) ? 
      (Number(displayItemData(item_id)) === 1 ? // 入力が1の場合のみ、1日を加算
        addDays(date, 1) 
        : addDays(date, Number(displayItemData(item_id))// 入力が以外
          -Math.ceil(Number(displayItemData(item_id))/10)))
      : newDate);
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
        isChecked && deleteClick(cart_id);
        mutate('http://localhost:3010/api/v1/stock_items');
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("ストックできません！");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Paper component="form" sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <TextField
          id="criteria"
          label="消費目安(日後)"
          name="criteria"
          value={criteriaInput}
          onChange={(e) => {
            const input = e.target.value;
            if (/^[0-9]*$/.test(input)) { // 入力が半角数字のみであることを確認
              if (input.length <= 5) {
                setCriteria(input);
                setCriteriaDate(addDays(date, Number(input)));
                if (Number(input) === 1) { // 入力が1の場合のみ、1日を加算
                  setAlarmDate(addDays(date, 1));
                } else {
                  setAlarmDate(addDays(date, Number(input)-Math.ceil(Number(input)/10)));
                }
              } else {
                toast.error('消費目安は5桁まで入力できます。');
              }
            } else {
              toast.error("数字は半角で入力してください。");
            }
          }}        
          helperText="※5桁まで"
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
              if (input.length <= 11) {
                setPrice(e.target.value)
              } else {
                toast.error('値段は11桁まで入力できます。');
              }
            }
            else {
              // setErrorMessage("数字は半角で入力してください。");
              toast.error("数字は半角で入力してください。");
              // setIsError(true);
            }
          }}
          helperText="※オプション（11桁まで）"
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
              if (input.length <= 5) {
                setQuantity(e.target.value)
              } else {
                toast.error('数量は5桁まで入力できます。');
              }
            }
            else {
              // setErrorMessage("数字は半角で入力してください。");
              toast.error("数字は半角で入力してください。");
              // setIsError(true);
            }
          }}
          helperText="※オプション（5桁まで）"
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
        <Typography variant="body1" color="textSecondary">
          目安消費日： {format(criteriaDate, 'yyyy-MM-dd', {locale:ja})}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          アラーム設定日： {format(alarmDate, 'yyyy-MM-dd', {locale:ja})}
        </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button onClick={stockClick} disabled={isLoading}
          sx={{
            color: '#ff7f50',
            '&:hover': {
            backgroundColor: '#fff7f1',
          },
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold', 
          fontSize: '1.2rem', 
        }}>
          <Inventory /> 
          {isLoading ? 'Loading...' : 'ストック'}
        </Button>
        <FormControlLabel
          control={
            <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} 
            
            sx={{
              paddingLeft: 2,
              color: '#ff7f50', // チェックマークの色
              '&.Mui-checked': {
                color: '#ff7f50',
              },
            }}/>
          }
          label="ストック後に削除"
          sx={{
            fontSize: '0.1rem', 
            color: '#4B4B4B', // ラベルの文字色
        }}/>
      </Box>
      <div style={{ display: "flex" }}>
      <Box sx={{ marginLeft: "auto" }}>
        <Button variant="contained" color="error" onClick={() => deleteClick(cart_id)}>返品</Button>
      </Box>
      </div>
      </Paper>
    );
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
          <Box width="100%" marginTop="10px">
            <Flex alignItems="center" justifyContent="center">
              <ShoppingCart style={{ color: "#4B4B4B" }} />
              <Typography style={{ color: "#4B4B4B", marginLeft: "0.5rem" }}>カート</Typography>
            </Flex>
            <Toaster />

            {data.data && (
              <Grid container spacing={2} sx={{ backgroundColor: '#f4f4f4' }} marginTop="20px">
                {data.data.map((cart: any) => (
                  <Grid item xs={12} sm={6} md={4} key={cart.id}>
                    <Card  sx={{
                      maxWidth: 500,
                      boxShadow: '2px 5px 10px -5px #9e9e9e',
                      borderRadius: 10,
                      }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={cart.product_picture ? 
                        `/images/${cart.product_picture}` : '/images/default.png'}
                      alt={cart.item_name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      pl={2}
                      pr={3}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        '& svg': {
                          marginRight: '0.25em',
                        },
                      }}
                    >
                      
                    
                          <FaShoppingCart style={{ marginRight: "0.25em" }} />
                          商品名:{" "}
                        <span style={{ fontWeight: "bold", maxWidth: '80%', 
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'  }}>
                          {cart.item_name}
                        </span>
                      </Typography>
                    </Box>
                      <Typography  variant="body2"
                        color="text.secondary"
                        gutterBottom
                        pl={2}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                          '& svg': {
                            marginRight: '0.25em',
                          },
                        }}>
                          <BiCategory style={{ marginRight: "0.25em" }} />
                          カテゴリー:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {cart.category_product_name || cart.category_grocery_name}
                        </span>
                      </Typography>
                      <Typography variant="body2"
                      color="text.secondary"
                      gutterBottom
                      pl={2}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        '& svg': {
                          marginRight: '0.25em',
                        },
                      }}>
                          <BiCategory style={{ marginRight: "0.25em" }} />
                          サブカテゴリー:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {cart.sub_category_product_name || cart.sub_category_grocery_name}
                        </span>
                      </Typography>
                    </CardContent>
                  <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <AddStockButton item_id={cart.item_id} cart_id={cart.id} cart_criteria={cart.criteria} cart_price={cart.price}
                    className="text-white bg-indigo-500 border-0 py-2 px-8 
                    focus:outline-none hover:bg-indigo-600 rounded text-lg" />
                  </Box>
                  
                </Card>
              </Grid>
                ))}
                
              </Grid>
              )}
          {!data.data && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
            カートに何も入っていません。
          </Typography>
        )}
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Cart;
