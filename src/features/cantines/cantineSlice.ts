import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Cantine {
  _id?: string,
  jour: string,
  repas: string,
  desc: string,
  creation_date: string,
  fichier_base64_string: string,
  fichier_extension: string,
  fichier: string,
}

export const cantineSlice = createApi({
  reducerPath: "Cantine",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/cantines`,
  }),
  tagTypes: ["Cantine"],
  endpoints(builder) {
    return {
      fetchCantines: builder.query<Cantine[], number | void>({
        query() {
          return `/getCantines`;
        },
        providesTags: ["Cantine"],
      }),
      addCantine: builder.mutation<void, Cantine>({
        query(payload) {
          return {
            url: "/createCantine",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Cantine"],
      }),
      updateCantine: builder.mutation<void, Cantine>({
        query: ({ _id, ...rest }) => ({
          url: `/updateCantine/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Cantine"],
      }),
      deleteCantine: builder.mutation<void, Cantine>({
        query: (_id) => ({
          url: `/deleteCantine/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Cantine"],
      }),
    };
  },
});

export const {
 useAddCantineMutation,
 useDeleteCantineMutation,
 useFetchCantinesQuery,
 useUpdateCantineMutation
} = cantineSlice;