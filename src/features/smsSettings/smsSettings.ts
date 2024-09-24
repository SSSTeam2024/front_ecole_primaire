import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UpdatePayload {
    id: string,
    status: string
    name? : string
  }

export interface SmsSetting {
  _id?: string,
  service_name: string,
  sms_status: string
}

export const smsSettingSlice = createApi({
  reducerPath: "SmsSetting",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}/api/sms-settings`,
  }),
  tagTypes: ["SmsSetting", "UpdatePayload"],
  endpoints(builder) {
    return {
      fetchSmsSettings: builder.query<SmsSetting[], number | void>({
        query() {
          return `/getSmsSettings`;
        },
        providesTags: ["SmsSetting"],
      }),
      updateSmsSettings: builder.mutation<void, UpdatePayload[]>({
        query(payload) {
          return {
            url: "/updateSmsSetting",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["SmsSetting", "UpdatePayload"],
      }),
      updateSmsSettingById: builder.mutation<void, UpdatePayload>({
        query: (payload) => ({
          url: `/updateSmsSettingById`,
          method: "PATCH",
          body: payload,
        }),
        invalidatesTags: ["SmsSetting"],
      }),
    };
  },
});

export const {
 useFetchSmsSettingsQuery,
 useUpdateSmsSettingsMutation,
 useUpdateSmsSettingByIdMutation
} = smsSettingSlice;