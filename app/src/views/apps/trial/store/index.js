// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllTrials } from "../../../../api/trials.js";

export const getData = createAsyncThunk("appTrial/getData", async (params) => {
  const response = await getAllTrials(params);
  console.log(response.data);
  return {
    params,
    data: response.data,
    totalPages: response.meta.total,
  };
});

export const appTrialsSlice = createSlice({
  name: "appTrial",
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

export default appTrialsSlice.reducer;
