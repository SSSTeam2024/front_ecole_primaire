import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Note {
  _id?: string;
  classe: string;
  eleves: any[];
  matiere: string;
  trimestre: string;
  type: string;
  date: string;
}

interface UpdateNoteData {
  _id?: string;
  updateData: any;
  eleves: any[];
}

export const noteSlice = createApi({
  reducerPath: "Note",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/notes`,
  }),
  tagTypes: ["Note"],
  endpoints(builder) {
    return {
      fetchNotes: builder.query<Note[], number | void>({
        query() {
          return `/getNotes`;
        },
        providesTags: ["Note"],
      }),
      addNote: builder.mutation<void, Note>({
        query(payload) {
          return {
            url: "/newNote",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Note"],
      }),
      updateNote: builder.mutation<void, UpdateNoteData>({
        query: ({ _id, ...rest }) => ({
          url: `/updateNote/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Note"],
      }),
        deleteNote: builder.mutation<void, Note>({
          query: (_id) => ({
            url: `/deleteNote/${_id}`,
            method: "Delete",
          }),
          invalidatesTags: ["Note"],
        }),
    };
  },
});

export const { useAddNoteMutation, useFetchNotesQuery, useDeleteNoteMutation, useUpdateNoteMutation } = noteSlice;
