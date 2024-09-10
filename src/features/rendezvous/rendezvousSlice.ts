import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Rendezvous {
  _id?: string;
  titre: string;
  date: string;
  description: string;
  parents: string[];
  heure: string;
  matiere?: string;
  administration: string;
}

export const rendezvousSlice = createApi({
  reducerPath: "Rendezvous",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/rendez-vous`,
  }),
  tagTypes: ["Rendezvous"],
  endpoints(builder) {
    return {
      fetchRendezvous: builder.query<Rendezvous[], number | void>({
        query() {
          return `/getRendezvous`;
        },
        providesTags: ["Rendezvous"],
      }),
      fetchRendezvousByEnseignantId: builder.query<Rendezvous[], number | void>(
        {
          query: (_id) => ({
            url: `/rendezvous-enseignant-id/${_id}`,
            method: "GET",
          }),
          providesTags: ["Rendezvous"],
        }
      ),
      addRendezvous: builder.mutation<void, Rendezvous>({
        query(payload) {
          return {
            url: "/createRendezvous",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Rendezvous"],
      }),
      updateRendezvous: builder.mutation<void, Rendezvous>({
        query: ({ _id, ...rest }) => ({
          url: `/updateRendezvous/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Rendezvous"],
      }),
      deleteRendezvous: builder.mutation<void, Rendezvous>({
        query: (_id) => ({
          url: `/deleteRendezvous/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Rendezvous"],
      }),
    };
  },
});

export const {
  useAddRendezvousMutation,
  useFetchRendezvousByEnseignantIdQuery,
  useDeleteRendezvousMutation,
  useFetchRendezvousQuery,
  useUpdateRendezvousMutation,
} = rendezvousSlice;
