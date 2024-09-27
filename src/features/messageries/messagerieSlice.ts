import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Messagerie {
  _id?: string,
  msg: string,
  sender: string,
  receiver: string,
  date: string,
  heure: string,
  fichier_base64_string: string[],
  fichier_extension: string[],
  fichiers: string[],
}

export const messagerieSlice = createApi({
  reducerPath: "Messagerie",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/messages`,
  }),
  tagTypes: ["Messagerie"],
  endpoints(builder) {
    return {
        getMessageries: builder.query<Messagerie[], number | void>({
        query() {
          return `/getMessageries`;
        },
        providesTags: ["Messagerie"],
      }),
      getMessageriesByParentId: builder.mutation<Messagerie[], string | void>({
        query: (id) => ({
          url: `/messagesByParent/${id}`,
          method: "GET",
        }),
        invalidatesTags: ["Messagerie"],
      }),
      newMessagerie: builder.mutation<void, Messagerie>({
        query(payload) {
          return {
            url: "/newMessagerie",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Messagerie"],
      }),
      deleteMessagerie: builder.mutation<void, Messagerie>({
        query: (_id) => ({
          url: `/deleteMessagerie/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Messagerie"],
      }),
    };
  },
});

export const {
 useDeleteMessagerieMutation,
 useGetMessageriesQuery,
 useNewMessagerieMutation,
 useGetMessageriesByParentIdMutation
} = messagerieSlice;