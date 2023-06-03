import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Product: NextPage = () => {
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/items",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((item: any, index: number) => (
        <li className='p-4' key={item.id}>
          <p>ID: {item.id}</p>
          <p>Picture: {item.picture}</p>
          <p>Created at: {item.created_at}</p>
          <p>Updated at: {item.updated_at}</p>
          <p>Category Product ID: {item.category_item_id}</p>
          <p>Sub Category Product ID: {item.sub_category_item_id}</p>
          <p>Item ID: {item.item_id}</p>
          <p>Maker ID: {item.maker_id}</p>
          <Link href={`http://localhost:3000/item/${item.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Product;