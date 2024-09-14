import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Parent {
  _id?: string;
  cin: string;
  nom_parent: string;
  prenom_parent: string;
  phone: string;
  username: string;
  password?: string;
  fils: {
    _id: string;
    nom: string;
    prenom: string;
    avatar: string;
  }[];
  profession: string;
}

export const parentSlice = createApi({
  reducerPath: "Parent",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/parents`,
  }),
  tagTypes: ["Parent"],
  endpoints(builder) {
    return {
      fetchParents: builder.query<Parent[], number | void>({
        query() {
          return `/getAllParents`;
        },
        providesTags: ["Parent"],
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
} = parentSlice;
