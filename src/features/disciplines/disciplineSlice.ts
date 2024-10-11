import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Discipline {
  _id?: string;
  eleve: string[];
  type: string;
  texte: string;
  editeur: string;
  date: string;
  classe: string;
  fichier_base64_string: string;
  fichier_extension: string;
  fichier: string;
}

export const disciplineSlice = createApi({
  reducerPath: "Discipline",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/disciplines`,
  }),
  tagTypes: ["Discipline"],
  endpoints(builder) {
    return {
      fetchDisciplines: builder.query<Discipline[], number | void>({
        query() {
          return `/getDisciplines`;
        },
        providesTags: ["Discipline"],
      }),
      getDisciplinesByEleveId: builder.mutation<Discipline[], string | void>({
        query: (id) => ({
          url: `/discipline-eleve-id/${id}`,
          method: "GET",
        }),
        invalidatesTags: ["Discipline"],
      }),
      addDiscipline: builder.mutation<void, Discipline>({
        query(payload) {
          return {
            url: "/newDiscipline",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Discipline"],
      }),
      updateDiscipline: builder.mutation<void, Discipline>({
        query: ({ _id, ...rest }) => ({
          url: `/updateDiscipline/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Discipline"],
      }),
        deleteDiscipline: builder.mutation<void, Discipline>({
          query: (_id) => ({
            url: `/deleteDiscipline/${_id}`,
            method: "Delete",
          }),
          invalidatesTags: ["Discipline"],
        }),
    };
  },
});

export const { useAddDisciplineMutation, useFetchDisciplinesQuery, useDeleteDisciplineMutation, useGetDisciplinesByEleveIdMutation, useUpdateDisciplineMutation } =
  disciplineSlice;
