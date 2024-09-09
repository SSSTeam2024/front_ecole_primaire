import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Classe {
  _id?: string,
  nom_classe: string,
}

export const classeSlice = createApi({
  reducerPath: "Classe",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/classes`,
  }),
  tagTypes: ["Classe"],
  endpoints(builder) {
    return {
      fetchClasses: builder.query<Classe[], number | void>({
        query() {
          return `/getClasses`;
        },
        providesTags: ["Classe"],
      }),
      addClasse: builder.mutation<void, Classe>({
        query(payload) {
          return {
            url: "/newClasse",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Classe"],
      }),
      updateClasse: builder.mutation<void, Classe>({
        query: ({ _id, ...rest }) => ({
          url: `/updateClasse/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Classe"],
      }),
      deleteClasse: builder.mutation<void, Classe>({
        query: (_id) => ({
          url: `/deleteClasse/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Classe"],
      }),
    };
  },
});

export const {
 useAddClasseMutation,
 useFetchClassesQuery,
 useDeleteClasseMutation,
 useUpdateClasseMutation
} = classeSlice;