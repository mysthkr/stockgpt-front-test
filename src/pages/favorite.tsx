import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState, useEffect } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "../lib/auth";
import React from "react";
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import { Alert, Skeleton, Tab, Tabs, TextField, Typography,Paper, IconButton, Grid, 
  CardMedia, CardContent, Card, Box, styled, Button } from '@mui/material';
import toast, { Toaster } from "react-hot-toast";
import { MdFavorite } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { getCookie } from "lib/getCookie";
import { ShoppingCart } from "@mui/icons-material";
import { GrFavorite } from "react-icons/gr";

const CustomGrFavorite = styled(GrFavorite)({
  color: 'pink', 
});

const CustomMdFavorite = styled(MdFavorite)({
  color: '#ff7f50', 
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("favorites");

const Favorite = (props: any) => {
  console.log(props);
  const [favorite, setFavorite] = useState(true);

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

  console.log("props");
  console.log(props.data);

  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const favoriteIds = props.data.map((favorite: any) => favorite.item_id);
  console.log("favoriteIds");
  console.log(favoriteIds);
  const initialFavorites: { [itemId: string]: boolean } = {};
  favoriteIds.forEach((itemId: string) => {
    initialFavorites[itemId.toString()] = true;
  });
  const [favorites, setFavorites] = useState<{ [itemId: string]: boolean }>(initialFavorites);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllData();
      setAllData(data.data);
    }
    fetchData();
  }, []);

  interface AddCartButtonProps {
    className: string;
    item_id: number;
  }

  const displayItemData = (itemId: number) => {
    const itemData = allData.find((data: any) => data.item_id === itemId);
    if (itemData) {
      console.log(itemData);
      return itemData.criteria;
    } else {
      return null;
    }
  }

  const AddCartButton: React.FC<AddCartButtonProps> = ({ className, item_id }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [criteriaInput, setCriteria] = useState(displayItemData(item_id) ? 
    displayItemData(item_id) : '');
    

    const addClick = async () => {
      setIsLoading(true);
      const cookieData = getCookie();
      try {
        const item = {
          criteria: Number(criteriaInput),
          item_id: Number(item_id),
        }
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
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("カートに追加できません！");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Paper component="form" sx={{ padding: "1rem", marginBottom: "1rem" }}>
        <Button onClick={addClick} disabled={isLoading}
        sx={{
          color: '#ff7f50',
          '&:hover': {
            backgroundColor: '#fff7f1',
          },
          display: 'flex',
          alignItems: 'center',
        }}>
          <ShoppingCart />
          {isLoading ? 'Loading...' : 'カートに追加'}
        </Button>
      </Paper>
    );
  };

  const handleAddFavorite = async (itemId: number) => {
    const cookieData = getCookie();
      try {
        setIsLoading(true);
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/favorites`, {
        //   method: 'POST',
        //   credentials: 'include',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     "uid": cookieData?.uid || "",
        //     "client": cookieData?.client || "",
        //     "access-token": cookieData?.accessToken || "",
        //   },
        //   body: JSON.stringify({ favorite: { item_id: itemId } }),
        // });
  
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // この部分でレスポンスを処理します...
        // const data = await response.json();
        setFavorites({ ...favorites, [itemId]: true });
        toast.success("お気に入りしました！");
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("お気に入りできません！");
      } finally {
        setIsLoading(false);
      }
    setFavorite(true);
  };

  const handleRemoveFavorite = async (itemId: number) => {
    // ここでお気に入り削除のAPIリクエストを送信します。
    // APIリクエストが成功したら、setFavoriteを使ってステートを更新します。
    setIsLoading(true);
      const cookieData = getCookie();
      console.log("delete favorite")
      console.log(cookieData);
      console.log(itemId);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/favorites/${itemId}`, {
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
        
        const newFavorites = { ...favorites };
        delete newFavorites[itemId];
        setFavorites(newFavorites);
        toast.success("お気に入り解除しました！");
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("お気に入り解除できません！");
      } finally {
        setIsLoading(false);
      }
  };

  return (
      <Layout {...props}>
        <Flex padding={2} justifyContent="center">
          <Flex
            width={{ base: '100%', md: '1040px' }}
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box width="100%" marginX="auto" marginTop="10px" minWidth="500px">
            <Flex alignItems="center" justifyContent="center">
              <CustomMdFavorite />
              <Typography style={{ color: "#4B4B4B", marginLeft: "0.5rem" }}>お気に入り</Typography>
            </Flex>
            <Toaster />
    {props.data && (
              <Grid container spacing={2} sx={{ backgroundColor: '#f4f4f4' }} marginTop="20px">
                {props.data.map((favorite: any) => (
                  <Grid item xs={12} sm={6} md={4} key={favorite.id}>
                    <Card  sx={{
                      maxWidth: 500,
                      boxShadow: '2px 5px 10px -5px #9e9e9e',
                      borderRadius: 10,
                      margin: 2,
                      minWidth: 230,
                      }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={favorite.product_picture ? 
                        `/images/${favorite.product_picture}` : '/images/default.png'}
                      alt={favorite.item_name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      
                    
                      
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
                          {favorites[favorite.item_id] ? (
                    <IconButton onClick={() => handleRemoveFavorite(favorite.item_id)}>
                      <CustomMdFavorite />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleAddFavorite(favorite.item_id)}>
                      <CustomGrFavorite />
                    </IconButton>
                  )}
                      </Typography>
                    </Box>
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
                          {favorite.item_name}
                        </span>
                  
                    
                  </Typography>
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
                          {favorite.category_product_name || favorite.category_grocery_name}
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
                          {favorite.sub_category_product_name || favorite.sub_category_grocery_name}
                        </span>
                      </Typography>
                    </CardContent>
                  <Box display="flex" justifyContent="space-between" marginTop={2}  marginLeft={4}>
                    <AddCartButton item_id={favorite.item_id}
                      className="text-white bg-indigo-500 border-0 py-2 px-8 
                      focus:outline-none hover:bg-indigo-600 rounded text-lg" 
                    />
                  </Box>
                  
                </Card>
              </Grid>
                ))}
                
              </Grid>
              )}
          {!props.data && (
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

export default Favorite;