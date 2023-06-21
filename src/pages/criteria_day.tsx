import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState, useEffect, useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Box, Button, Alert, Skeleton, Tab, Tabs, TextField, Typography,Paper, ThemeProvider, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, IconButton, styled, Grid, Card, CardMedia, CardContent } from '@mui/material';
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
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef, GridRowParams, GridRowsProp, GridToolbar } from "@mui/x-data-grid";
import DescriptionIcon from '@mui/icons-material/Description';
import React from "react";
import { theme } from "themes";
import { FaShoppingCart } from "react-icons/fa";

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

// const CustomDataGrid = styled(DataGrid)({
//   '& .MuiDataGrid-columnHeaders': {
//     backgroundColor: '#FFC1A1',

//   },
//   // その他のカスタムスタイル
// });


const Cart: NextPage = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/items`,
    fetcher
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  interface SelectedRow {
    id: number;
    picture: string | null;
    sub_category_name: string;
    category_name: string;
    sub_category_product_name: any;
    category_product_name: any;
    sub_category_grocery_name: any;
    category_grocery_name: any;
    item_name: string;
    criteria: string;
    price: number;
    alarm_date: string;
    quantity: number;
  }


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

  // interface AllData {
  //   data: Array<{ item_id: number, criteria: string }>;
  // }
  const [allData, setAllData] = useState<any>({ data: [] });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllData();
      setAllData(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("allData");
    console.log(allData);
  }, [allData]);

  const displayItemData = (itemId: number) => {
    const itemData = allData.data.find(data => data.item_id === itemId);
    if (itemData) {
      console.log("itemData");
      console.log(itemData);
      return itemData.criteria;
    } else {
      return null;
    }
  }
  // END HERE

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;
  

  const deleteClick = async (criteriaId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/criteria_days/${criteriaId}`, {
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
      toast.success("情報を削除しました！");
      mutate(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/items`);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };

  interface AddCustomizeButtonProps {
    className: string;
    item_id: number;
    // criteria_days: number;
  }

  

  const AddCustomizeButton: React.FC<AddCustomizeButtonProps> = ({ className , item_id, criteria_days}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [criteriaInput, setCriteria] = useState(displayItemData(item_id) ? 
    displayItemData(item_id) : '');
    


    const addClick = async () => {
      setIsLoading(true);
      const cookieData = getCookie();
      try {
        const criteria_day = {
          criteria: Number(criteriaInput),
          item_id: Number(item_id),
          price: 0
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/criteria_days`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
          body: JSON.stringify(criteria_day),
        })
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // この部分でレスポンスを処理します...
        const data = await response.json();
        toast.success("登録しました！");
        mutate(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/items`);
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("登録できません！");
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
            if (/^[0-9]*$/.test(input)) { 
              if (input.length <= 5) {
                setCriteria(e.target.value);
              } else {
                toast.error('消費目安は5桁まで入力できます。');
              }
            } else {
              toast.error("数字は半角で入力してください。");
            }
          }}
          autoComplete="criteria"
          helperText="※5桁まで"
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
        <Button color="success" onClick={addClick} disabled={isLoading} sx={{ backgroundColor: '#ff7f50' , color: 'white', margin: '15px 5px'}}>
          {isLoading ? 'Loading...' : '登録'}
        </Button>
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
        <Typography className="text-3xl font-bold text-center" style={{ marginTop: '20px', textAlign: 'center'}}>カスタマイズ</Typography>
        <Toaster />
        <Grid container spacing={2} sx={{ backgroundColor: '#f4f4f4' }} marginTop="20px">
          {data.data.map((item: any) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{
                maxWidth: 500,
                boxShadow: '2px 5px 10px -5px #9e9e9e',
                borderRadius: 10,
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.picture ? `/images/${item.picture}` : '/images/default.png'}
                  alt={item.name}
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
                      <span style={{ fontWeight: "bold", maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </span>
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
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
                    }}
                  >
                    おすすめ消費目安: {item.criteria}日
                  </Typography>
                  <Box display="flex" justifyContent="space-between" marginTop={2} >
                    <AddCustomizeButton item_id={item.id} className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Flex>
  </Flex>
</Layout>
  );
};

export default Cart;
