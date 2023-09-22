// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAll, getSingleUser } from "../../../../api/user";
// ** Axios Imports
import axios from "axios";
import { getAllSponsor } from "../../../../api/sponsor";

export const getData = createAsyncThunk("appUsers/getData", async (params) => {
  const response = await getAllSponsor({per_page: params.perPage, page: params.page});

  return {
    params,
    data: response.data,
    totalPages: response.meta.total,
  };
});

export const getUser = createAsyncThunk("appUsers/getUser", async (id) => {
  const response = await getSingleUser(id);
  return response.data;
});

export const addUser = createAsyncThunk(
  "appUsers/addUser",
  async (user, { dispatch, getState }) => {
    await axios.post("/apps/users/add-user", user);
    await dispatch(getData(getState().users.params));
    return user;
  }
);

export const deleteUser = createAsyncThunk(
  "appUsers/deleteUser",
  async (id, { dispatch, getState }) => {
    await axios.delete("/apps/users/delete", { id });
    await dispatch(getData(getState().users.params));
    return id;
  }
);

export const appUsersSlice = createSlice({
  name: "appUsers",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.params = action.payload.params;
        state.total = action.payload.totalPages;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      });
  },
});

export default appUsersSlice.reducer;
