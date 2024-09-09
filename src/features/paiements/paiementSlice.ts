import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Paiement {
  _id?: string;
  eleve: string;
  annee_scolaire: string,
  montant: string,
  date_paiement: string,
}

export const paiementSlice = createApi({
  reducerPath: "Paiement",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/paiements`,
  }),
  tagTypes: ["Paiement"],
  endpoints(builder) {
    return {
      fetchPaiements: builder.query<Paiement[], number | void>({
        query() {
          return `/getPaiements`;
        },
        providesTags: ["Paiement"],
      }),
      addPaiement: builder.mutation<void, Paiement>({
        query(payload) {
          return {
            url: "/createPaiement",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Paiement"],
      }),
      updatePaiement: builder.mutation<void, Paiement>({
        query: ({ _id, ...rest }) => ({
          url: `/updatePaiement/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Paiement"],
      }),
        deletePaiement: builder.mutation<void, Paiement>({
          query: (_id) => ({
            url: `/deletePaiement/${_id}`,
            method: "Delete",
          }),
          invalidatesTags: ["Paiement"],
        }),
    };
  },
});

export const { useAddPaiementMutation, useDeletePaiementMutation, useFetchPaiementsQuery, useUpdatePaiementMutation } = paiementSlice;
