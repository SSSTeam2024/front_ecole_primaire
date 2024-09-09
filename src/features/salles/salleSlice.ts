import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Salle {
  _id?: string,
  nom_salle: string,
}

export const salleSlice = createApi({
  reducerPath: "Salle",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/salles`,
  }),
  tagTypes: ["Salle"],
  endpoints(builder) {
    return {
      fetchSalles: builder.query<Salle[], number | void>({
        query() {
          return `/getSalles`;
        },
        providesTags: ["Salle"],
      }),
      addSalle: builder.mutation<void, Salle>({
        query(payload) {
          return {
            url: "/createSalle",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Salle"],
      }),
      updateSalle: builder.mutation<void, Salle>({
        query: ({ _id, ...rest }) => ({
          url: `/updateSalle/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Salle"],
      }),
      deleteSalle: builder.mutation<void, Salle>({
        query: (_id) => ({
          url: `/deleteSalle/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Salle"],
      }),
    };
  },
});

export const {
 useAddSalleMutation,
 useDeleteSalleMutation,
 useFetchSallesQuery,
 useUpdateSalleMutation
} = salleSlice;