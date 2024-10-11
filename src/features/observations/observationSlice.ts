import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Observation {
  _id?: string,
  titre: string,
  date: string,
  description: string,
  classe: string[],
  fichier_base64_string: string,
  fichier_extension: string,
  fichier: string,
  par?: string,
}

export const observationSlice = createApi({
  reducerPath: "Observation",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/observations`,
  }),
  tagTypes: ["Observation"],
  endpoints(builder) {
    return {
      fetchObservations: builder.query<Observation[], number | void>({
        query() {
          return `/getObservations`;
        },
        providesTags: ["Observation"],
      }),
      addObservation: builder.mutation<void, Observation>({
        query(payload) {
          return {
            url: "/newObservation",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Observation"],
      }),
      updateObservation: builder.mutation<void, Observation>({
        query: ({ _id, ...rest }) => ({
          url: `/updateObservation/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Observation"],
      }),
      deleteObservation: builder.mutation<void, Observation>({
        query: (_id) => ({
          url: `/deleteObservation/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Observation"],
      }),
    };
  },
});

export const {
 useAddObservationMutation,
 useFetchObservationsQuery,
 useDeleteObservationMutation,
 useUpdateObservationMutation
} = observationSlice;