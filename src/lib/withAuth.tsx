import { withAuthFetch } from "./withAuthFetch";

export async function withGetServerSideProps(context: { query?: any; req?: any; res?: any; }) {
  const { req, res } = context;
  const { id } = context.query;
  console.log(req);

  const response = await withAuthFetch(`groceries/${id}`, req.cookies);
  console.log(response.headers);
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