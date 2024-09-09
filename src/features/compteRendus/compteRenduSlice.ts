import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Note {
  note: string;
  eleve: string;
}

export interface Compterendu {
  _id?: string,
  classe: string,
  titre: string,
  desc: string,
  matiere:string,
  enseignant:string,
  creation_date: string,
  fichier_base64_string: string,
  fichier_extension: string,
  fichier: string,
  notes: Note[];
}

export const compteRenduSlice = createApi({
  reducerPath: "CompteRendu",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/compteRendus`,
  }),
  tagTypes: ["CompteRendu"],
  endpoints(builder) {
    return {
      fetchCompteRendu: builder.query<Compterendu[], number | void>({
        query() {
          return `/getCompteRendus`;
        },
        providesTags: ["CompteRendu"],
      }),
      addCompteRendu: builder.mutation<void, Compterendu>({
        query(payload) {
          return {
            url: "/newCompteRendu",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["CompteRendu"],
      }),
      deleteCompteRendu: builder.mutation<void, Compterendu>({
        query: (_id) => ({
          url: `/deleteCompteRendu/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["CompteRendu"],
      }),
    };
  },
});

export const {
 useAddCompteRenduMutation,
 useDeleteCompteRenduMutation,
 useFetchCompteRenduQuery
} = compteRenduSlice;