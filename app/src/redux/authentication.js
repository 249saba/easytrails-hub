// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

const initialUser = () => {
  const item = window.localStorage.getItem("userData");
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {};
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    userData: initialUser(),
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload;
      state.userData.role = "admin"
      state["acessToken"] = action.payload["acessToken"];
      localStorage.setItem("userData", JSON.stringify(action.payload));
      localStorage.setItem(
        "acessToken",
        JSON.stringify(action.payload.accessToken)
      );
    },
    handleLogout: (state) => {
      state.userData = {};
      state["acessToken"] = null;
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("acessToken");
    },
  },
});

export const { handleLogin, handleLogout } = authSlice.actions;

export default authSlice.reducer;
