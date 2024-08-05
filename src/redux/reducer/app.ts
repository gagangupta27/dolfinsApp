import Api, { setToken } from "../../utils/Api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Credentials } from "react-native-auth0";
import { Storage } from "../../utils/storage";

export const fetchCalendarEvents = createAsyncThunk(
  "/api/1.0/user/calendar_event/list",
  async () => {
    const res = await Api.get("/api/1.0/user/calendar_event/list");
    return res.data;
  }
);

export const fetchCalendars = createAsyncThunk(
  "/api/1.0/user/calendar/list",
  async () => {
    const res = await Api.get("/api/1.0/user/calendar/list");
    return res.data;
  }
);

type InitialStateType = {
  authData: null | Credentials;
  calendarEvents: any[];
  calendars: { string: boolean } | null;
  calendarLastSynced: number | null; // Use number for timestamp
  postsData: any;
  status: any;
  error: any;
};

const initialState: InitialStateType = {
  authData: null,
  calendarEvents: [],
  calendars: null,
  calendarLastSynced: null,
  postsData: {},
  status: null,
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.authData = action.payload;
      if (action.payload) {
        Storage.setItem("authData", JSON.stringify(action.payload));
      } else {
        Storage.removeItem("authData");
      }
      if (state.authData && state.authData.idToken)
        setToken(state.authData.idToken);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCalendarEvents.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.calendarEvents = action.payload.events;
        state.calendarLastSynced = Date.now(); // Update last synced time on successful fetch
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCalendars.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCalendars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.calendars = action.payload;
      })
      .addCase(fetchCalendars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setAuthData } = appSlice.actions;

export default appSlice.reducer;
