import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Emploi {
  _id?: string;
  titre: string;
  date: string;
  classe: string;
  image_base64_string?: string;
  image_extension?: string;
  image?: string;
}

export const emploiSlice = createApi({
  reducerPath: "Emploi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/emplois`,
  }),
  tagTypes: ["Emploi"],
  endpoints(builder) {
    return {
      fetchEmplois: builder.query<Emploi[], number | void>({
        query() {
          return `/getEmplois`;
        },
        providesTags: ["Emploi"],
      }),
      addEmploi: builder.mutation<void, Emploi>({
        query(payload) {
          return {
            url: "/newEmploi",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Emploi"],
      }),
      updateEmploi: builder.mutation<void, Emploi>({
        query: ({ _id, ...rest }) => ({
          url: `/updateEmploi/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Emploi"],
      }),
        deleteEmploi: builder.mutation<void, Emploi>({
          query: (_id) => ({
            url: `/deleteEmploi/${_id}`,
            method: "Delete",
          }),
          invalidatesTags: ["Emploi"],
        }),
    };
  },
});

export const { useAddEmploiMutation, useFetchEmploisQuery, useDeleteEmploiMutation, useUpdateEmploiMutation } =
emploiSlice;
