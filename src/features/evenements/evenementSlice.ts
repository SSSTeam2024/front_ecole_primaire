import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Evenement {
  _id?: string,
  classes: string[],
  titre: string,
  desc: string,
type: string,
  creation_date: string,
  fichier_base64_string: string,
  fichier_extension: string,
  fichier: string,
}

export const evenementSlice = createApi({
  reducerPath: "Evenement",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/evenements`,
  }),
  tagTypes: ["Evenement"],
  endpoints(builder) {
    return {
      fetchEvenement: builder.query<Evenement[], number | void>({
        query() {
          return `/getEvenement`;
        },
        providesTags: ["Evenement"],
      }),
      addEvenement: builder.mutation<void, Evenement>({
        query(payload) {
          return {
            url: "/newEvenement",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Evenement"],
      }),
      updateEvenement: builder.mutation<void, Evenement>({
        query: ({ _id, ...rest }) => ({
          url: `/updateEvenement/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Evenement"],
      }),
      deleteEvenement: builder.mutation<void, Evenement>({
        query: (_id) => ({
          url: `/deleteEvenement/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Evenement"],
      }),
    };
  },
});

export const {
 useAddEvenementMutation,
 useDeleteEvenementMutation,
 useFetchEvenementQuery,
 useUpdateEvenementMutation
} = evenementSlice;