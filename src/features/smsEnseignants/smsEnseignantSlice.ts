import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SmS {
  _id?: string,
  sender: string,
  msg: string,
  status: string,
  receiver?: string,
  include_names?: string,
  specefic_enseignants? : string[],
  sms_par_destinataire?: string,
  total_sms?: string,
}

export const smsEnseignantSlice = createApi({
  reducerPath: "smsEnseignant",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/sms-enseignant`,
  }),
  tagTypes: ["SmS"],
  endpoints(builder) {
    return {
      fetchSmS: builder.query<SmS[], number | void>({
        query() {
          return `/getSms`;
        },
        providesTags: ["SmS"],
      }),
      sendSmS: builder.mutation<void, void>({
        query() {
            return {
              url: "/send-pending-smses",
              method: "POST",
            };
          },
          invalidatesTags: ["SmS"],
      }),
      addSmS: builder.mutation<void, SmS>({
        query(payload) {
          return {
            url: "/createSms",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["SmS"],
      }),
      updateSmS: builder.mutation<void, SmS>({
        query: ({ _id, ...rest }) => ({
          url: `/updateSms/${_id}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["SmS"],
      }),
      deleteSmS: builder.mutation<void, SmS>({
        query: (_id) => ({
          url: `/deleteSms/${_id}`,
          method: "Delete",
        }),
        invalidatesTags: ["SmS"],
      }),
      deleteSmsEnAttente: builder.mutation<void, void>({
        query() {
          return {
            url: "/delete-pending-smses",
            method: "DELETE",
          };
        },
        invalidatesTags: ["SmS"],
      }),
    };
  },
});

export const {
 useAddSmSMutation,
 useDeleteSmSMutation,
 useFetchSmSQuery,
 useUpdateSmSMutation,
 useSendSmSMutation,
 useDeleteSmsEnAttenteMutation
} = smsEnseignantSlice;