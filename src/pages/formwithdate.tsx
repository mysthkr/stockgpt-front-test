import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router'

import axios from 'axios';
import useSWR from 'swr';
import { getMultipleFetcher } from '../utils/getMultipleFetcher';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Stack, Autocomplete, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers';

type Inputs = {
  category: any;
  sub_category: any;
  date: Date;
};

const LabelStyle = styled('span')({
  color: "rgba(0, 0, 0, 0.6)",
  fontSize: 15,
  marginRight: 15
});

const Form: NextPage = () => {
  const baseURI = 'http://localhost:3010/api/v1';

  const catURI = `${baseURI}/categories`;
  const subCatURI = `${baseURI}/sub_categories`;

  const urls = [catURI, subCatURI];
  const { data, error } = useSWR(urls, getMultipleFetcher);
  // const [currentImage, setImage] = useState(new Blob)
  // const [imageUrl, setImageUrl] = useState("")

  const { control, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues: { date: new Date() },
  });

  const validationRules = {
    user: {
      required: 'user is required',
    },
    shop: {
      required: 'shop is required',
    },
    date: {
      validate: (val: Date | null) => {
        if (val == null) {
          return 'date is required';
        }
        if (Number.isNaN(val.getTime())) {
          return 'invalid date';
        }
        return true;
      },
    },
  };

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  const router = useRouter()
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const { category, sub_category, date } = data;
    const formData = new FormData();

    formData.append("category", category.id);
    formData.append("sub_category", sub_category.id);
    formData.append("date", date?.toString());

    axios({
      url: `${baseURI}/search`,
      method: "post",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then(() => router.push("/"))
      .catch((error) => {
        alert("エラーが発生しました。");
      });
  };
  return (
    <LocalizationProvider>
      <Stack
        component='form'
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
        sx={{ m: 2, width: '80ch' }}
      >
        <Controller
          control={control}
          name='category'
          render={({ props }) => (
            <Autocomplete
              fullWidth
              options={data[0]}
              renderInput={(params) => <TextField {...params} label='category' />}
              onChange={(event, value) => {
                setValue('category', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            />
          )}
        />
        <Controller
          control={control}
          name='sub_category'
          render={({ props }) => (
            <Autocomplete
              fullWidth
              options={data[1]}
              getOptionLabel={(option) => option?.name}
              renderInput={(params) => <TextField {...params} label='sub_category' />}
              onChange={(event, value) => {
                setValue('sub_category', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            />
          )}
        />
        <Controller
          name='date'
          control={control}
          rules={validationRules.date}
          render={({ field, fieldState }) => (
            <DatePicker
              mask='____/__/__'
              inputFormat='yyyy/MM/dd'
              label='Date'
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={fieldState.error?.message}
                />
              )}
              {...field}
            />
          )}
        />
        <Button variant='contained' type='submit' color="info">
          Submit
        </Button>
      </Stack>
    </LocalizationProvider >
  );
};

export default Form;

