import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Evaluations {
  _id?: string;
  eleve: string;
  matiere: string;
  trimestre: string;
  note: string;
  date: string;
}

export const evaluationsSlice = createApi({
  reducerPath: "Evaluations",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/evaluations`,
  }),
  tagTypes: ["Evaluations"],
  endpoints(builder) {
    return {
      fetchEvaluationss: builder.query<Evaluations[], number | void>({
        query() {
          return `/getEvaluations`;
        },
        providesTags: ["Evaluations"],
      }),
      addEvaluations: builder.mutation<void, Evaluations>({
        query(payload) {
          return {
            url: "/createEvaluation",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Evaluations"],
      }),
      updateEvaluations: builder.mutation<void, Evaluations>({
        query: ({ _id, ...rest }) => ({
          url: `/updateEvaluation/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Evaluations"],
      }),
        deleteEvaluations: builder.mutation<void, Evaluations>({
          query: (_id) => ({
            url: `/deleteEvaluation/${_id}`,
            method: "Delete",
          }),
          invalidatesTags: ["Evaluations"],
        }),
    };
  },
});

export const { useAddEvaluationsMutation, useDeleteEvaluationsMutation, useFetchEvaluationssQuery, useUpdateEvaluationsMutation } = evaluationsSlice;
