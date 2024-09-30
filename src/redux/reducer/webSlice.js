import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Api from "../../utils/Api";

export const setWebDataApi = createAsyncThunk(
  "web/setWebDataApi",
  async (arg, thunkAPI) => {
    return Api.post("/api/1.0/user/user_data/", {
      user_id: 1,
      data: arg,
    })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
  }
);

export const getWebDataApi = createAsyncThunk("web/getWebDataApi", async () => {
  const res = await Api.get("/api/1.0/user/user_data/1");
  return res.data;
});

const initialState = {
  webData: null,
};

const webSlice = createSlice({
  name: "web",
  initialState,
  reducers: {
    setWebData: (state, action) => {
      state.webData = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getWebDataApi.pending, (state, action) => {})
      .addCase(getWebDataApi.fulfilled, (state, action) => {
        state.webData = action.payload?.data;
      })
      .addCase(getWebDataApi.rejected, (state, action) => {
        console.log("getWebDataApi err");
      })
      .addCase(setWebDataApi.pending, (state, action) => {})
      .addCase(setWebDataApi.fulfilled, (state, action) => {
        if (action?.payload?.data?.data) {
          state.webData = action?.payload?.data?.data;
        }
      })
      .addCase(setWebDataApi.rejected, (state, action) => {
        console.log("getWebDataApi err");
      });
  },
});

export const { setWebData } = webSlice.actions;

export default webSlice.reducer;
