import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "app/store";

export interface UserResponse {
  central: {
    _id?: string;
    name: string;
    login: string;
    password: string;
    logoBase64String: string;
    logoExtension: string;
    logo: string;
  };
}
export interface Account {
  accessToken: string;
  central: {
    _id?: string;
    name: string;
    login: string;
    password: string;
    logoBase64String: string;
    logoExtension: string;
    logo: string;
  };
}

export interface LoginRequest {
  login: string;
  password: string;
}

export const accountSlice = createApi({
  reducerPath: "account",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/central/`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth?.central.api_token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Account"],
  endpoints(builder) {
    return {
      login: builder.mutation<UserResponse, LoginRequest>({
        query: (credentials) => ({
          url: "/login",
          method: "POST",
          body: credentials,
        }),
      }),
    };
  },
});

export const {
  useLoginMutation,
} = accountSlice;
