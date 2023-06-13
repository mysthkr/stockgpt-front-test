import useSWR from 'swr';

// フェッチ関数
const fetcher = (url: RequestInfo | URL) => fetch(url).then(r => r.json())

// カスタムフック
const useUser = () => {
  const { data, mutate } = useSWR('/api/user', fetcher)

  const uid = data?.uid;
  const client = data?.client;
  const accessToken = data?.accessToken;
  const userId = data?.userId;
  const groupId = data?.groupId;

  return {
    uid,
    client,
    accessToken,
    userId,
    groupId,
    mutate
  };
};

export default useUser;
