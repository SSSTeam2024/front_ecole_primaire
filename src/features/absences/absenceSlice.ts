import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Absence {
  _id?: string;
  classe: string;
  matiere: string;
  enseignant: string;
  eleves: { eleve: string; typeAbsent: string }[];
  heure: string;
  date: string;
  trimestre: string
}

export const absenceSlice = createApi({
  reducerPath: "Absence",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/absences`,
  }),
  tagTypes: ["Absence"],
  endpoints(builder) {
    return {
      fetchAbsences: builder.query<Absence[], number | void>({
        query() {
          return `/getAbsences`;
        },
        providesTags: ["Absence"],
      }),
      addAbsence: builder.mutation<void, Absence>({
        query(payload) {
          return {
            url: "/newAbsence",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Absence"],
      }),
      updateAbsence: builder.mutation<void, Absence>({
        query: ({ _id, ...rest }) => ({
          url: `/updateAbsence/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Absence"],
      }),
      deleteAbsence: builder.mutation<void, Absence>({
        query: (_id) => ({
          url: `/deleteAbsence/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Absence"],
      }),
    };
  },
});

export const { useAddAbsenceMutation, useDeleteAbsenceMutation, useFetchAbsencesQuery, useUpdateAbsenceMutation } = absenceSlice;
