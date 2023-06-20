import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useState, useEffect, useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Switch, Tooltip, styled } from "@mui/material";
import IOSSwitch from "components/atoms/IosSwitch";
import { getCookie } from "lib/getCookie";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
// import Button from 'components/atoms/Button'
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef, GridRowParams, GridRowsProp, GridToolbar,jaJP  } from '@mui/x-data-grid'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SvgIcon } from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import React from "react";


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

const theme = createTheme({
  palette: {
    primary: { main: '#ff7f50' },
  },
}, jaJP);

const CustomDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#FFC1A1',

  },
  // その他のカスタムスタイル
});

const StockItem: NextPage = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/stock_items`,
    fetcher
  );
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();
  const [sortedData, setSortedData] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };


  useEffect(() => {
    if (data) {
      setSortedData(data.data);
    }
  }, [data]);
  

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSorted(event.target.checked);
    if (event.target.checked) {
      const sorted = [...sortedData].sort((a, b) => ((a.alarm_date < b.alarm_date) ? -1 : 1));
      setSortedData(sorted);
    } else {
      // Switchがオフの時は元のデータをセットします
      setSortedData(data.data);
    }
  };

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  const deleteClick = async (stockItemId: number) => {
    setIsLoading(true);
    const cookieData = getCookie();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/stock_items/${stockItemId}`, {
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
      toast.success("ストックから削除しました！");
      mutate(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/stock_items`);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error("削除できません！");
    } finally {
      setIsLoading(false);
    }
  };

  function List({ data }: { data: any[] }) {
    const handleDetailClick = useCallback(
      (params: GridRowParams) => (event: { stopPropagation: () => void }) => {
        event.stopPropagation();
        setSelectedRow(params.row);
        handleDialogOpen();
      },
      []
    );

    const handleDeleteClick = useCallback(
      (params: GridRowParams) => (event: { stopPropagation: () => void }) => {
        event.stopPropagation();
        console.log("params.row.id");
        console.log(params.row.id);
        deleteClick(params.row.id);
      },
      []
    );
    
  
    // 表示するアクションを返す関数です
    const getDetailAction = React.useCallback(
      (params: GridRowParams) => [
        <GridActionsCellItem
          icon={
            <Tooltip title="詳細画面へ">
              <IconButton>
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
          }
          label="詳細"
          onClick={handleDetailClick(params)}
          color="inherit"
        />
      ],
      [handleDetailClick]
    )
    const cols: GridColDef[] = [
      {
        field: 'detailAction',
        headerName: '',
        align: 'left',
        width: 60,
        type: 'actions', 
        getActions: getDetailAction
      } as GridColDef,
      {
        field: 'item_name',
        headerAlign: 'center',
        headerName: 'アイテム名',
        align: 'center',
      },
      {
        field: 'alarm_date',
        headerAlign: 'center',
        headerName: 'アラーム日',
        align: 'center',
      },
      {
        field: 'category_name',
        headerAlign: 'center',
        headerName: 'カテゴリー',
        align: 'center',
      },
      {
        field: 'sub_category_name',
        headerAlign: 'center',
        headerName: 'サブカテゴリー',
        align: 'center',
      },
      {
        field: 'criteria',
        headerAlign: 'center',
        headerName: '使用目安(日)',
        align: 'center',
      },
      {
        field: 'price',
        headerAlign: 'center',
        headerName: '値段',
        align: 'center',
      },
      {
        field: 'quantity',
        headerAlign: 'center',
        headerName: '数量',
        align: 'center',
      },
      // {
      //   field: 'id',
      //   headerAlign: 'center',
      //   headerName: 'id',
      //   align: 'center',
      // },
      {
        field: "deleteAction",
        headerAlign: "center",
        headerName: "",
        align: "center",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params: GridCellParams) => (
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteClick(params)}
          >
            削除
          </Button>
        ),
      },
    ];

    const rows: GridRowsProp =  data.map(stock_item => ({
      id: stock_item.id,
      item_name: stock_item.item_name,
      criteria: stock_item.criteria,
      price: stock_item.price,
      alarm_date: stock_item.alarm_date,
      quantity: stock_item.quantity,
      category_name: stock_item.category_grocery_name 
                    || stock_item.category_product_name,
      sub_category_name: stock_item.sub_category_grocery_name 
                        || stock_item.sub_category_product_name,
      picture: stock_item.product_picture,
    }))

    return (
      <div style={{ width: '100%' }}>
        <ThemeProvider theme={theme}>
          <CustomDataGrid columns={cols} rows={rows} density='comfortable' 
            autoHeight hideFooterSelectedRowCount
            slots={{
              toolbar: GridToolbar,
            }} 
            sx={{
              '& .rows-active': {
                background: '#ffe5b4 !important'
              }
            }}
            getRowClassName={(params: GridRowParams) => {
              const alarmDate = new Date(params.row.alarm_date);
              alarmDate.setHours(0, 0, 0, 0);  // 時間を0に設定
              // 今日の日付を取得（時間部分を無視するため、年、月、日だけを指定）
              const today = new Date();
              today.setHours(0, 0, 0, 0);  // 時間を0に設定

              // console.log("alarmDate, today")
              // console.log(alarmDate);
              // console.log(today);
              // console.log(alarmDate <= today);
            
              // 日付を比較
              if (alarmDate <= today) {
                return 'rows-active';
              }
              return '';
            }}
          />
        </ThemeProvider>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>詳細</DialogTitle>
          <DialogContent>
            {selectedRow && (
              <div>
                <p>アイテム名：{selectedRow.item_name}</p>
                <p>アラーム日：{selectedRow.alarm_date}</p>
                <p>カテゴリー：{selectedRow.category_name}</p>
                <p>サブカテゴリー：{selectedRow.sub_category_name}</p>
                <p>Criteria: {selectedRow.criteria}</p>
                <p>Price: {selectedRow.price}</p>
                <p>Quantity: {selectedRow.quantity}</p>
                <p>{selectedRow.picture}</p>
                <Button variant="contained" color="error" onClick={() => deleteClick(selectedRow.id)}>削除</Button>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  return (
    <Layout {...data}>
      <Flex padding="20px" justifyContent="center">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%"  marginBottom={{ base: '2', md: '0' }}>
            <Flex justifyContent="flex-end">
              <Box padding="10px">
                <Grid component="label" container alignItems="center" spacing={1}>
                  <Grid item>登録順</Grid>
                    <Grid item>
                      <IOSSwitch
                        checked={isSorted}
                        onChange={handleSortChange}
                        inputProps={{ 'aria-label': 'Sort items' }}
                      />
                    </Grid>
                  <Grid item>アラーム日順</Grid>
                </Grid>
              </Box>
            </Flex>
          <Box marginBottom="5" />
          <Toaster />
          <List data={sortedData} />
            
          </Box >
            
        </Flex>
      </Flex>
    </Layout>
  );
};

export default StockItem;
