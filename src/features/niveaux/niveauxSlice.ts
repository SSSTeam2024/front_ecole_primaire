import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Niveau {
  _id?: string,
  nom_niveau: string,
  type: string
}

export const niveauSlice = createApi({
  reducerPath: "Niveau",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/niveaux`,
  }),
  tagTypes: ["Niveau"],
  endpoints(builder) {
    return {
        getNiveaux: builder.query<Niveau[], number | void>({
        query() {
          return `/getNiveaux`;
        },
        providesTags: ["Niveau"],
      }),
      createNiveau: builder.mutation<void, Niveau>({
        query(payload) {
          return {
            url: "/createNiveau",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Niveau"],
      }),
      updateNiveau: builder.mutation<void, Niveau>({
        query: ({ _id, ...rest }) => ({
          url: `/updateNiveau/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Niveau"],
      }),
      deleteNiveau: builder.mutation<void, Niveau>({
        query: (_id) => ({
          url: `/deleteNiveau/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Niveau"],
      }),
    };
  },
});

export const {
 useCreateNiveauMutation,
 useDeleteNiveauMutation,
 useGetNiveauxQuery,
 useUpdateNiveauMutation
} = niveauSlice;