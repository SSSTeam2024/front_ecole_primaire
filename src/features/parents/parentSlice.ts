import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Parent {
  _id?: string;
  cin: string;
  nom_parent: string;
  prenom_parent: string;
  phone: string;
  username: string;
  password?: string;
  fils?: {
    _id: string;
    nom: string;
    prenom: string;
    avatar: string;
    classe?: any
  }[];
  profession: string;
}

export interface UpdatePasswordParent {
  _id?: string;
  password?: string;
}

export const parentSlice = createApi({
  reducerPath: "Parent",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/parents`,
  }),
  tagTypes: ["Parent", "UpdatePasswordParent"],
  endpoints(builder) {
    return {
      fetchParents: builder.query<Parent[], number | void>({
        query() {
          return `/getAllParents`;
        },
        providesTags: ["Parent"],
      }),
      fetchParentById: builder.mutation<Parent, string | void>({
        query: (_id) => ({
          url: `/getParent/${_id}`,
          method: "GET",
        }),
        invalidatesTags: ["Parent"],
      }),
      addParent: builder.mutation<void, Parent>({
        query(payload) {
          return {
            url: "/newParent",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Parent"],
      }),
      updateParent: builder.mutation<void, Parent>({
        query: ({ _id, ...rest }) => ({
          url: `/updateParent/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Parent"],
      }),
      updatePassword: builder.mutation<void, UpdatePasswordParent>({
        query: ({ _id, ...rest }) => ({
          url: `/updateParentPassword/${_id}`,
          method: "PUT",
          body: rest,
        }),
        invalidatesTags: ["Parent", "UpdatePasswordParent"],
      }),
      deleteParent: builder.mutation<void, Parent>({
        query: (_id) => ({
          url: `/deleteParent/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Parent"],
      }),
    };
  },
});

export const {
  useAddParentMutation,
  useFetchParentsQuery,
  useDeleteParentMutation,
  useUpdateParentMutation,
  useFetchParentByIdMutation,
  useUpdatePasswordMutation
} = parentSlice;
