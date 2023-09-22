// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAll } from "../../../../api/activity";

export const getData = createAsyncThunk(
  "appActivity/getData",
  async (params) => {
    const response = await getAll(params);
    return {
      params,
      data: response.data,
      totalPages: response.meta.total,
    };
  }
);

export const appActivitySlice = createSlice({
  name: "appActivity",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.params = action.payload.params;
      state.total = action.payload.totalPages;
    });
  },
});

export default appActivitySlice.reducer;
