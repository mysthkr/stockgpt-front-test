import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Product: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/makers",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((maker: any, index: number) => (
        <li className='p-4' key={maker.id}>
          <p>ID: {maker.id}</p>
          <p>Picture: {maker.picture}</p>
          <p>Created at: {maker.created_at}</p>
          <p>Updated at: {maker.updated_at}</p>
          <p>Category Product ID: {maker.category_maker_id}</p>
          <p>Sub Category Product ID: {maker.sub_category_maker_id}</p>
          <p>Item ID: {maker.maker_id}</p>
          <p>Maker ID: {maker.maker_id}</p>
          <Link href={`http://localhost:3000/maker/${maker.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Product;