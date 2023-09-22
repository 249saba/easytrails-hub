// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    query: '',
    bookmarks: [],
    suggestions: []
  },
  reducers: {
    handleSearchQuery: (state, action) => {
      state.query = action.payload
    }
  },
  extraReducers: builder => {
  }
})

export const { handleSearchQuery } = layoutSlice.actions

export default layoutSlice.reducer
