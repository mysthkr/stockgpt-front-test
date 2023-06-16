import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState, useEffect } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Alert, IconButton, Paper, Skeleton, Tab, Tabs, TextField, Typography, 
        Grid, Card, CardContent, CardMedia, Button, Box, styled} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { TabPanel } from "@mui/lab";
import { ItemDialog } from "components/organisms/ItemDialog";
// import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
// import Button from 'components/atoms/Button'
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie"
import { getCookie } from "lib/getCookie";
import { GrFavorite } from "react-icons/gr";
import { MdFavorite } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { FaIndustry, FaShoppingCart } from "react-icons/fa"; 
import { BiCategory } from "react-icons/bi"; 
import { ShoppingCartIcon } from "components/atoms/IconButton";
import { Search } from "@mui/icons-material";


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

// カスタムアイコンの色を定義するスタイル
const CustomGrFavorite = styled(GrFavorite)({
  color: 'pink', 
});

const CustomMdFavorite = styled(MdFavorite)({
  color: '#ff7f50', 
});


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
  const [itemData, setItemData] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = useState(1);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push('/grocery');
  };
  
  useEffect(() => {
    if (data) {
      setItemData(data.data);
    }
  }, [data]);

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
    // START HERE for fetchAllCriteriaData
    const fetchFavoriteAllData = async () => {
      const cookieData = getCookie();
      const response = await fetch("http://localhost:3010/api/v1/favorites",{
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
    // const [allFavoriteData, setAllFavoriteData] = useState({ data: [] });
    const [allData, setAllData] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<{ [itemId: string]: boolean }>({});
  
    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchAllData();
        setAllData(data.data);
      }
      fetchData();
    }, []);

    useEffect(() => {
      const fetchFavoriteData = async () => {
        const data = await fetchFavoriteAllData();
        const favoriteItems: { [itemId: string]: boolean } = {};
        data.data.forEach((item: { item_id: string | number; }) => {
          favoriteItems[item.item_id] = true;
        });
        setFavorites(favoriteItems);
      }
      fetchFavoriteData();
    }, []);

    const displayItemData = (itemId: number) => {
      const itemData = allData.find((data: any) => data.item_id === itemId);
      if (itemData) {
        console.log(itemData);
        return itemData.criteria;
      } else {
        return null;
      }
    }
  
    // const displayFavoriteData = (itemId: number) => {
    //   // const allData: AllData = { data: [] };
    //   const itemData = allFavoriteData.data.find(data => data.item_id === itemId);
    //   if (itemData) {
    //     console.log(itemData);
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // END HERE

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  // useEffect(() => {
  //   getInitialFavorites();
  // }, []);

  interface AddCartButtonProps {
    className: string;
    item_id: number;
  }

  const AddCartButton: React.FC<AddCartButtonProps> = ({ className, item_id }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [criteriaInput, setCriteria] = useState(displayItemData(item_id) ? 
    displayItemData(item_id) : '');
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
        displayItemData(item_id) ? setCriteria(displayItemData(item_id)) 
        : setCriteria('');
        setPrice('');
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("カートに追加できません！");
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
          helperText="※オプション（5桁まで）"
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
              }else {
                toast.error('消費目安は11桁まで入力できます。');
              }
            } else {
              toast.error("数字は半角で入力してください。");
            }
          }}
          autoComplete="price"
          helperText="※オプション（11桁まで）"
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
        <Button onClick={addClick} disabled={isLoading}
        sx={{
          color: '#ff7f50',
          '&:hover': {
            backgroundColor: '#fff7f1',
          },
          display: 'flex',
          alignItems: 'center',
        }}>
          <ShoppingCartIcon />
          {isLoading ? 'Loading...' : 'カートに追加'}
        </Button>
      </Paper>
    );
  }

  interface AddListButtonProps {
    className: string;
    item_id: number;
  }
  const AddListButton: React.FC<AddListButtonProps> = ({ className , item_id}) => {
    const [isLoading, setIsLoading] = useState(false);

    const addClick = async () => {
      setIsLoading(true);
      const cookieData = getCookie();
      try {
        const item = {
          item_id: Number(item_id),
        }
        const response = await fetch('http://localhost:3010/api/v1/to_buy_lists', {
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
        toast.success("買い物リストに追加しました！");
        // setCriteria('');
        // setPrice('');
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error("買い物リストに追加できません！");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Paper component="form" sx={{ padding: "1rem", marginBottom: "1rem" }}>
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
        <Button onClick={addClick} disabled={isLoading}
          sx={{
            color: '#ff7f50',
            '&:hover': {
            backgroundColor: '#fff7f1',
          },
          display: 'flex',
          alignItems: 'center',
        }}>
          <EditNoteIcon /> 
          {isLoading ? 'Loading...' : '買い物リストに追加'}
        </Button>
      </Paper>
    );
  }

  //検索機能
  const changeText = (e: any) => {
    setText(e.target.value);
  }

  const clickSubmit = async (e: any) => {
    e.preventDefault(); 
    const cookieData = getCookie();
    const axiosInstance = axios.create({
      baseURL: `http://localhost:3010/api/v1/`,
    });
      setIsError(false);
      setErrorMessage("");
      try {
        const response = await axiosInstance.post("searches", {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
          data: text,
        });
        setItemData(response.data);
      } catch (error: any) {
        setIsError(true);
        if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0]) {
          setErrorMessage(error.response.data.errors[0]);
        } else {
          setErrorMessage("An error occurred");
        }
      }
  };

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
        const response = await fetch(`http://localhost:3010/api/v1/favorites/${itemId}`, {
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

  
  const itemDataExists = itemData.length > 0;

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
            <TabPanel value={value} index={0} sx={{ marginY: 'auto', marginX: 'auto' }}>
            </TabPanel>
            <TabPanel value={value} index={1} sx={{ marginY: 'auto', marginX: 'auto' }}>
            </TabPanel>
            <Box width="300px" marginX="auto"  mb={4} mt={2}>
            <form method="POST" onSubmit={clickSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                value={text}
                onChange={changeText}
                label="検索"
                size="small"
                sx={{ marginRight: '8px', flex: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<Search />}
                sx={{
                  backgroundColor: '#ff7f50',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#ff7f50',
                    transform: 'translateY(5px)',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s',
                }}
              >
                検索
              </Button>
            </form>
          </Box>
            {itemDataExists && (
            <Grid container spacing={2} sx={{ backgroundColor: '#f4f4f4' }}>
              {itemData.map((product: any) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card  sx={{
                  maxWidth: 500,
                  boxShadow: '2px 5px 10px -5px #9e9e9e',
                  borderRadius: 10,
                  }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`/images/${product.picture}`}
                  alt={product.item_name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary" gutterBottom pl={2} pr={3}>
                      <FaIndustry style={{ marginRight: "0.25em" }} />
                      Item ID:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {product.item_id}
                    </span>
                  </Typography>
                  {favorites[product.item_id] ? (
                    <IconButton onClick={() => handleRemoveFavorite(product.item_id)}>
                      <CustomMdFavorite />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleAddFavorite(product.item_id)}>
                      <CustomGrFavorite />
                    </IconButton>
                  )}
                </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom pl={2}>
                      <FaShoppingCart style={{ marginRight: "0.25em" }} />
                      商品名:{" "}
                    <span style={{ fontWeight: "bold", maxWidth: '80%', 
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'  }}>
                      {product.item_name}
                    </span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom pl={2}>
                      <BiCategory style={{ marginRight: "0.25em" }} />
                      カテゴリー:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {product.category_product_name}
                    </span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom pl={2}>
                      <BiCategory style={{ marginRight: "0.25em" }} />
                      サブカテゴリー:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {product.sub_category_product_name}
                    </span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom pl={2}>
                      <FaIndustry style={{ marginRight: "0.25em" }} />
                      メーカー名:{" "}
                      <span style={{ fontWeight: "bold" }}>
                      {product.maker_name}
                      </span>
                  </Typography>
                  <Box display="flex" justifyContent="space-between" marginTop={2} >
                    <AddCartButton item_id={product.item_id}
                      className="text-white bg-indigo-500 border-0 py-2 px-8 
                      focus:outline-none hover:bg-indigo-600 rounded text-lg" 
                      />
                  </Box>
                  <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <AddListButton item_id={product.item_id}
                      className="text-white bg-indigo-500 border-0 py-2 px-8 
                      focus:outline-none hover:bg-indigo-600 rounded text-lg" />
                  </Box>
                  </CardContent>
                </Card>
              </Grid>
              ))}
            </Grid>
            )}
            {!itemDataExists && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                該当する商品が見つかりませんでした。
              </Typography>
            )}
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Product;