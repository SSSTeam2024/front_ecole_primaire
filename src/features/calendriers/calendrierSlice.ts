import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Calendrier {
  _id?: string;
  salle: string;
  trimestre: string;
  heure_debut: string;
  heure_fin: string;
  date: string;
  matiere: string;
  classe: string;
  enseignant: string;
}

export const calendrierSlice = createApi({
  reducerPath: "Calendrier",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/calendriers`,
  }),
  tagTypes: ["Calendrier"],
  endpoints(builder) {
    return {
      fetchCalendrier: builder.query<Calendrier[], number | void>({
        query() {
          return `/getCalendriers`;
        },
        providesTags: ["Calendrier"],
      }),
      addCalendrier: builder.mutation<void, Calendrier>({
        query(payload) {
          return {
            url: "/createCalendrier",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Calendrier"],
      }),
      updateCalendrier: builder.mutation<void, Calendrier>({
        query: ({ _id, ...rest }) => ({
          url: `/updateCalendrier/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Calendrier"],
      }),
      deleteCalendrier: builder.mutation<void, Calendrier>({
        query: (_id) => ({
          url: `/deleteCalendrier/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Calendrier"],
      }),
    };
  },
});

export const {
  useAddCalendrierMutation,
  useDeleteCalendrierMutation,
  useFetchCalendrierQuery,
  useUpdateCalendrierMutation,
} = calendrierSlice;
