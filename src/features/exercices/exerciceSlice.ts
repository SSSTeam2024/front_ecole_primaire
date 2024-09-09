import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Exercice {
  _id?: string,
  matiere: string,
  classes: string[],
  desc: string,
  creation_date: string,
  badge_date: string,
  fichier_base64_string: string,
  fichier_extension: string,
  fichier: string,
  enseignant?: string,
}

export const exerciceSlice = createApi({
  reducerPath: "Exercice",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/exercices`,
  }),
  tagTypes: ["Exercice"],
  endpoints(builder) {
    return {
      fetchExercices: builder.query<Exercice[], number | void>({
        query() {
          return `/getExercices`;
        },
        providesTags: ["Exercice"],
      }),
      addExercice: builder.mutation<void, Exercice>({
        query(payload) {
          return {
            url: "/newExercice",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Exercice"],
      }),
      deleteExercice: builder.mutation<void, Exercice>({
        query: (_id) => ({
          url: `/deleteExercice/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Exercice"],
      }),
    };
  },
});

export const {
 useAddExerciceMutation,
 useFetchExercicesQuery,
 useDeleteExerciceMutation
} = exerciceSlice;