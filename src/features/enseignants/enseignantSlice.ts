import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Enseignant {
  _id?: string,
  nom_enseignant: string,
  prenom_enseignant: string,
}

export const enseignantSlice = createApi({
  reducerPath: "Enseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/enseignants`,
  }),
  tagTypes: ["Enseignant"],
  endpoints(builder) {
    return {
      fetchEnseignants: builder.query<Enseignant[], number | void>({
        query() {
          return `/getEnseignants`;
        },
        providesTags: ["Enseignant"],
      }),
      addEnseignant: builder.mutation<void, Enseignant>({
        query(payload) {
          return {
            url: "/newEnseignant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Enseignant"],
      }),
      updateEnseignant: builder.mutation<void, Enseignant>({
        query: ({ _id, ...rest }) => ({
          url: `/updateEnseignant/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Enseignant"],
      }),
      deleteEnseignant: builder.mutation<void, Enseignant>({
        query: (_id) => ({
          url: `/deleteEnseignant/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Enseignant"],
      }),
    };
  },
});

export const {
 useAddEnseignantMutation,
 useFetchEnseignantsQuery,
 useDeleteEnseignantMutation,
 useUpdateEnseignantMutation
} = enseignantSlice;