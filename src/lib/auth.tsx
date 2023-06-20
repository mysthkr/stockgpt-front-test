import { GetServerSideProps } from "next";

export const withAuthFetch = async (url: string, cookies: { [x: string]: any; }): Promise<Response> => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/${url}`, {
    headers: {
      "Content-Type": "application/json",
      "uid": cookies["uid"],
      "client": cookies["client"],
      "access-token": cookies["access-token"],
    },
  });
};

export const withAuthServerSideProps = (url: string): GetServerSideProps => {
  return async (context) => {
    const { req, res } = context;
    const { id } = context.query;

    if (id !== undefined) {
      url = `${url}/${id}`;
    }
    console.log("url");
    console.log(url);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/${url}`, {
      headers: {
        "Content-Type": "application/json",
        "uid": req.cookies["uid"]!,
        "client": req.cookies["client"]!,
        "access-token": req.cookies["access-token"]!,
      },
    });
    if (!response.ok && response.status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    // TODO: 他にも500エラーを考慮した分岐も必要
    const props = await response.json();
    return { props };
  };
};