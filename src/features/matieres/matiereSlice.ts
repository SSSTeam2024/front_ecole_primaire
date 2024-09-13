import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Matieres {
  _id?: string,
  nom_matiere: string;
}

export interface Matiere {
  _id?: string,
  matieres: Matieres[],
  niveau: string
}

export const matiereSlice = createApi({
  reducerPath: "Matiere",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/matieres`,
  }),
  tagTypes: ["Matiere"],
  endpoints(builder) {
    return {
      fetchMatieres: builder.query<Matiere[], number | void>({
        query() {
          return `/getMatieres`;
        },
        providesTags: ["Matiere"],
      }),
      addMatiere: builder.mutation<void, Matiere>({
        query(payload) {
          return {
            url: "/newMatiere",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Matiere"],
      }),
      updateMatiere: builder.mutation<void, Matiere>({
        query: ({ _id, ...rest }) => ({
          url: `/updateMatiere/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Matiere"],
      }),
      deleteMatiere: builder.mutation<void, Matiere>({
        query: (_id) => ({
          url: `/deleteMatiere/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Matiere"],
      }),
    };
  },
});

export const {
 useAddMatiereMutation,
 useDeleteMatiereMutation,
 useFetchMatieresQuery,
 useUpdateMatiereMutation
} = matiereSlice;