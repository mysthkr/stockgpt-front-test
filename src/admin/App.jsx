// in src/admin/App.jsx
import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { getCookie } from "lib/getCookie";

// const httpClient = (url, options = {}) => {
//   if (!options.headers) {
//       options.headers = new Headers({ Accept: 'application/json' });
//   }
//   const token = localStorage.getItem('token');
//   options.headers.set('Authorization', `Bearer ${token}`);
//   return fetchUtils.fetchJson(url, options);
// }

// const httpClient = (url, options = {}) => {
//   if (!headers) {
//     headers = new Headers({ 
//       Accept: 'application/json',
//       "Content-Type": "application/json"
//     });
//   }
// }

//   // Cookie data retrieval
//   const cookieData = getCookie();

//   // Set cookie data to headers
//   headers.set('uid', cookieData?.uid || "");
//   headers.set('client', cookieData?.client || "");
//   headers.set('access-token', cookieData?.accessToken || "");
// const dataProvider = simpleRestProvider('http://localhost:3010/api/v1/admin', httpClient);
const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ 
      Accept: 'application/json',
      "Content-Type": "application/json",
      credentials: 'include',
      "uid": cookieData?.uid || "",
      "client": cookieData?.client || "",
      "access-token": cookieData?.accessToken || "",
    });
  }

  // Cookie data retrieval
  const cookieData = getCookie();

  // Set cookie data to headers
  options.headers.set('uid', cookieData?.uid || "");
  options.headers.set('client', cookieData?.client || "");
  options.headers.set('access-token', cookieData?.accessToken || "");
};

const dataProvider = jsonServerProvider('http://localhost:3010/api/v1/admin', httpClient);

// const dataProvider = jsonServerProvider('http://localhost:3010/api/v1/admin');

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={ListGuesser} edit={EditGuesser} recordRepresentation="name" />
    <Resource name="profiles" list={ListGuesser} edit={EditGuesser} recordRepresentation="title" />
    <Resource name="groceries" list={ListGuesser} edit={EditGuesser} recordRepresentation="grocery" />
    {/* <Resource name="comments" list={ListGuesser} edit={EditGuesser} /> */}
  </Admin>
);

export default App;