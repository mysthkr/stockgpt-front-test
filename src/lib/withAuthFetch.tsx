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