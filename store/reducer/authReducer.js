import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.auth = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

