import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Surveillant {
  _id?: string,
  nom_surveillant: string,
  prenom_surveillant: string,
  nom_utilisateur: string,
  mot_de_passe: string,
  tel: string
}

export const surveillantSlice = createApi({
  reducerPath: "Surveillant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/surveillants`,
  }),
  tagTypes: ["Surveillant"],
  endpoints(builder) {
    return {
        getSurveillants: builder.query<Surveillant[], number | void>({
        query() {
          return `/getSurveillants`;
        },
        providesTags: ["Surveillant"],
      }),
      createSurveillant: builder.mutation<void, Surveillant>({
        query(payload) {
          return {
            url: "/createSurveillant",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Surveillant"],
      }),
      updateSurveillant: builder.mutation<void, Surveillant>({
        query: ({ _id, ...rest }) => ({
          url: `/updateSurveillant/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Surveillant"],
      }),
      deleteSurveillant: builder.mutation<void, Surveillant>({
        query: (_id) => ({
          url: `/deleteSurveillant/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Surveillant"],
      }),
    };
  },
});

export const {
 useCreateSurveillantMutation,
 useDeleteSurveillantMutation,
 useGetSurveillantsQuery,
 useUpdateSurveillantMutation
} = surveillantSlice;