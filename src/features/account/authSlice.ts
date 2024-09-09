import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type AuthState = {
    central: {
        _id?: string;
        name: string;
        login: string;
        password: string;
        logo: string;
        api_token: string
      };
};

const slice = createSlice({
  name: "auth",
  initialState: { central: {
    _id: "",
    name: "",
    login: "",
    password: "",
    logo: "",
    api_token: ""
  } } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: {  central },
      }: PayloadAction<{
        central: any}>
    ) => {
      state.central = central;
    },
  },
});

export const { setCredentials } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.central;