// // 必要なフックをインポートする
// import React from "react";
// import { ReactNode, createContext, useContext } from 'react';

// // コンテキストオブジェクトを作成する
// const UserContext = React.createContext({});

// // コンテキストをラップするUserProviderコンポーネントを作成する
// export function UserProvider({ children }: { children: ReactNode }) {
//   const loginState = {
//     uid: "",
//     client: '',
//     access_token: '',
//     user_id: 0,
//     group_id: 0,
//   };

//   return (
//     <UserContext.Provider value={loginState}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// // コンテキストオブジェクトにアクセスするためのカスタムフックを作成する
// export function useUserContext() {
//   return useContext(UserContext);
// }