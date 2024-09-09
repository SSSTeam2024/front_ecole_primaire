import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Etudiant {
  _id?: string,
  nom: string,
  prenom: string,
  date_de_naissance: string,
  classe: string,
  parent?: string,
  genre: string,
  avatar_base64_string: string,
  avatar_extension: string,
  avatar: string,
}

export const etudiantSlice = createApi({
  reducerPath: "Etudiant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/etudiants`,
  }),
  tagTypes: ["Etudiant"],
  endpoints(builder) {
    return {
      fetchEtudiants: builder.query<Etudiant[], number | void>({
        query() {
          return `/getEtudiants`;
        },
        providesTags: ["Etudiant"],
      }),
      fetchEtudiantsByClasseId: builder.mutation<Etudiant[], string | void>({
        query: (id) => ({
          url: `/etudiants-classe-id/${id}`,
          method: "GET",
        }),
        invalidatesTags: ["Etudiant"],
      }),
      addEtudiant: builder.mutation<void, Etudiant>({
        query(payload) {
          return {
            url: "/newEtudiant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Etudiant"],
      }),
      updateEtudiant: builder.mutation<void, Etudiant>({
        query: ({ _id, ...rest }) => ({
          url: `/updateEtudiant/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Etudiant"],
      }),
      deleteEtudiant: builder.mutation<void, Etudiant>({
        query: (_id) => ({
          url: `/deleteEtudiant/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Etudiant"],
      }),
    };
  },
});

export const {
 useAddEtudiantMutation,
 useFetchEtudiantsQuery,
 useDeleteEtudiantMutation,
 useUpdateEtudiantMutation,
 useFetchEtudiantsByClasseIdMutation
} = etudiantSlice;