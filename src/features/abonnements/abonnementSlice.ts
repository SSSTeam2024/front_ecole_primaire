import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Abonnement {
  _id?: string;
  cantine: string
  eleve: string;
  type: string;
  status: string
}

export const abonnementSlice = createApi({
  reducerPath: "Abonnement",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/abonnements`,
  }),
  tagTypes: ["Abonnement"],
  endpoints(builder) {
    return {
      fetchAbonnements: builder.query<Abonnement[], number | void>({
        query() {
          return `/getAbonnements`;
        },
        providesTags: ["Abonnement"],
      }),
      getAbonnementsByEleveId: builder.mutation<Abonnement[], string | void>({
        query: (id) => ({
          url: `/abonnements-eleve-id/${id}`,
          method: "GET",
        }),
        invalidatesTags: ["Abonnement"],
      }),
      addAbonnement: builder.mutation<void, Abonnement>({
        query(payload) {
          return {
            url: "/createAbonnement",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Abonnement"],
      }),
        deleteAbonnement: builder.mutation<void, Abonnement>({
          query: (_id) => ({
            url: `/deleteAbonnement/${_id}`,
            method: "Delete",
          }),
          invalidatesTags: ["Abonnement"],
        }),
    };
  },
});

export const { useAddAbonnementMutation, useDeleteAbonnementMutation, useFetchAbonnementsQuery, useGetAbonnementsByEleveIdMutation } =
abonnementSlice;
