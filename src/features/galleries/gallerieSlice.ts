import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Gallerie {
  _id?: string,
  classes: string[],
  titre: string,
  desc: string,
  creation_date: string,
  fichier_base64_string: string[],
  fichier_extension: string[],
  fichiers: string[],
}

export const gallerieSlice = createApi({
  reducerPath: "Gallerie",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/galleries`,
  }),
  tagTypes: ["Gallerie"],
  endpoints(builder) {
    return {
      fetchGallerie: builder.query<Gallerie[], number | void>({
        query() {
          return `/getGallerie`;
        },
        providesTags: ["Gallerie"],
      }),
      addGallerie: builder.mutation<void, Gallerie>({
        query(payload) {
          return {
            url: "/newGallerie",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Gallerie"],
      }),
      updateGallerie: builder.mutation<void, Gallerie>({
        query: ({ _id, ...rest }) => ({
          url: `/updateGallerie/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Gallerie"],
      }),
      deleteGallerie: builder.mutation<void, Gallerie>({
        query: (_id) => ({
          url: `/deleteGallerie/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Gallerie"],
      }),
    };
  },
});

export const {
 useAddGallerieMutation,
 useDeleteGallerieMutation,
 useFetchGallerieQuery,
 useUpdateGallerieMutation
} = gallerieSlice;