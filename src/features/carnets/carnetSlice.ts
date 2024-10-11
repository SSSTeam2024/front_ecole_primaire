import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface EleveData {
  eleve: string;
  note: string;
  fichier: string;
  fichier_base64_string: string,
  fichier_extension: string,
}

export interface Carnet {
  _id?: string;
  classe: string;
  trimestre: string;
  date: string;
  eleves: EleveData[]
}

interface UpdateCarnetData {
  _id?: string;
  updateData: any;
  eleves: EleveData[];
}

export const carnetSlice = createApi({
  reducerPath: "Carnet",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/carnets`,
  }),
  tagTypes: ["Carnet"],
  endpoints(builder) {
    return {
      fetchCarnets: builder.query<Carnet[], number | void>({
        query() {
          return `/getCarnets`;
        },
        providesTags: ["Carnet"],
      }),
      addCarnet: builder.mutation<void, Carnet>({
        query(payload) {
          return {
            url: "/newCarnet",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Carnet"],
      }),
      updateCarnet: builder.mutation<void, UpdateCarnetData>({
        query: ({ _id, ...rest }) => ({
          url: `/updateCarnet/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["Carnet"],
      }),
      deleteCarnet: builder.mutation<void, Carnet>({
        query: (_id) => ({
          url: `/deleteCarnet/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["Carnet"],
      }),
    };
  },
});

export const { useAddCarnetMutation, useFetchCarnetsQuery, useDeleteCarnetMutation, useUpdateCarnetMutation } = carnetSlice;
