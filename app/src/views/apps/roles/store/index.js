// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllService } from "../../../../api/service.js";
import { getAllRoles } from "../../../../api/role.js";

export const getServiceData = createAsyncThunk(
  "appService/getData",
  async () => {
    const response = await getAllService();
    return {
      data: response.data,
    };
  }
);
export const getRolesData = createAsyncThunk(
  "appRole/getData",
  async ({ service, rowsPerPage, page }) => {
    const response = await getAllRoles(service, rowsPerPage, page);
    return {
      data: response.data,
      meta: response.meta,
    };
  }
);

export const appServiceSlice = createSlice({
  name: "appService",
  initialState: {
    data: [],
    roleData: [],
    total: "",
    current_page: "",
    last_page: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServiceData.fulfilled, (state, action) => {
      state.data = action.payload.data;
    });
    builder.addCase(getRolesData.fulfilled, (state, action) => {
      (state.roleData = action.payload.data),
        (state.total = action.payload.meta.total),
        (state.current_page = action.payload.meta.current_page),
        (state.last_page = action.payload.meta.last_page);
    });
  },
});

export default appServiceSlice.reducer;
