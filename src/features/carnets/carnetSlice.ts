import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Carnet {
  _id?: string;
  eleve: string;
  trimestre: string;
  note: string;
  date: string;
  fichier_base64_string: string;
  fichier_extension: string;
  fichier: string;
}

export const carnetSlice = createApi({
  reducerPath: "Carnet",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/carnets`,
  }),
  tagTypes: ["Carnet"],
  endpoints(builder) {
    return {
      fetchCarnets: builder.query<Carnet[], number | void>({
        query() {
          return `/getCarnets`;
        },
        providesTags: ["Carnet"],
      }),
      addCarnet: builder.mutation<void, Carnet>({
        query(payload) {
          return {
            url: "/newCarnet",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Carnet"],
      }),
      deleteCarnet: builder.mutation<void, Carnet>({
        query: (_id) => ({
          url: `/deleteCarnet/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Carnet"],
      }),
    };
  },
});

export const { useAddCarnetMutation, useFetchCarnetsQuery, useDeleteCarnetMutation } = carnetSlice;
