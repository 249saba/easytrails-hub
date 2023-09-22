// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getAllSites } from "../../../../api/site";

export const getData = createAsyncThunk("appUsers/getData", async (trialid,params) => {
  const response = await getAllSites(trialid,params.perPage);
  return {
    params,
    data: response.data,
    totalPages: response.meta.total,
  };
});


export const appSitesSlice = createSlice({
  name: "appSites",
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
  },
});

export default appSitesSlice.reducer;
