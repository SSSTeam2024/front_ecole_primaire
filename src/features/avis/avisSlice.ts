import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Avis {
  _id?: string,
  classes: string[],
  desc: string,
  editeur:string,
  creation_date: string,
  fichier_base64_string: string,
  fichier_extension: string,
  fichier: string,
}

export const avisSlice = createApi({
  reducerPath: "Avis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/avis`,
  }),
  tagTypes: ["Avis"],
  endpoints(builder) {
    return {
      fetchAvis: builder.query<Avis[], number | void>({
        query() {
          return `/getAvis`;
        },
        providesTags: ["Avis"],
      }),
      addAvis: builder.mutation<void, Avis>({
        query(payload) {
          return {
            url: "/newAvis",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Avis"],
      }),
      updateAvis: builder.mutation<void, Avis>({
        query: ({ _id, ...rest }) => ({
          url: `/updateAvis/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Avis"],
      }),
      deleteAvis: builder.mutation<void, Avis>({
        query: (_id) => ({
          url: `/deleteAvis/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Avis"],
      }),
    };
  },
});

export const {
 useAddAvisMutation,
 useDeleteAvisMutation,
 useFetchAvisQuery,
 useUpdateAvisMutation
} = avisSlice;