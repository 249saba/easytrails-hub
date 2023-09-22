// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllLanguage } from "../../../../api/language.js";

export const getData = createAsyncThunk(
  "appLanguage/getData",
  async (params) => {
    const response = await getAllLanguage(params);
    return {
      params,
      data: response.data,
      totalPages: response.meta.total,
    };
  }
);

export const appLanguagesSlice = createSlice({
  name: "appLanguage",
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
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

export default appLanguagesSlice.reducer;
