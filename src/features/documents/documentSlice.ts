import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Document {
  _id?: string,
  classes: string[],
  desc: string,
  creation_date: string,
  fichier_base64_string: string,
  fichier_extension: string,
  fichier: string,
}

export const documentSlice = createApi({
  reducerPath: "Document",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/documents`,
  }),
  tagTypes: ["Document"],
  endpoints(builder) {
    return {
      fetchDocument: builder.query<Document[], number | void>({
        query() {
          return `/getDocuments`;
        },
        providesTags: ["Document"],
      }),
      addDocument: builder.mutation<void, Document>({
        query(payload) {
          return {
            url: "/newDocument",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Document"],
      }),
      updateDocument: builder.mutation<void, Document>({
        query: ({ _id, ...rest }) => ({
          url: `/updateDocument/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Document"],
      }),
      deleteDocument: builder.mutation<void, Document>({
        query: (_id) => ({
          url: `/deleteDocument/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Document"],
      }),
    };
  },
});

export const {
 useAddDocumentMutation,
 useDeleteDocumentMutation,
 useFetchDocumentQuery,
 useUpdateDocumentMutation
} = documentSlice;