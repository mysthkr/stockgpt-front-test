import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getServerSideProps: GetServerSideProps =
  withAuthServerSideProps("sub_category_products");

const SubCategoryProduct: NextPage = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/sub_category_products`,
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((sub_category_product: any) => (
        <li className='p-4' key={sub_category_product.id}>
          <p>ID: {sub_category_product.id}</p>
          <p>Created at: {sub_category_product.created_at}</p>
          <p>Updated at: {sub_category_product.updated_at}</p>
          <p>Category Grocery ID: {sub_category_product.category_sub_category_product_id}</p>
          <p>Sub Category Grocery ID: {sub_category_product.sub_category_sub_category_product_id}</p>
          <p>Item ID: {sub_category_product.item_id}</p>
          <p>Maker ID: {sub_category_product.maker_id}</p>
          <Link href={`http://localhost:3000/sub_category_product/${sub_category_product.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default SubCategoryProduct;