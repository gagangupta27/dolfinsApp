import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Api from "../../utils/Api";

export const setWebDataApi = createAsyncThunk("web/setWebDataApi", async (arg, thunkAPI) => {
    return Api.post("/api/1.0/user/user_data/", {
        user_id: thunkAPI.getState()?.app?.authData?.userId,
        data: arg,
    })
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error;
        });
});

export const getWebDataApi = createAsyncThunk("web/getWebDataApi", async (arg, thunkAPI) => {
    return Api.get(`/api/1.0/user/user_data/${thunkAPI.getState()?.app?.authData?.userId}`)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error;
        });
});

export const appleLogin = createAsyncThunk("web/appleLogin", async (arg, thunkAPI) => {
    return Api.get(`/api/1.0/user/auth/apple?token=${arg}`)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error;
        });
});

const initialState = {
    webData: null,
    sessionId: null,
};

const webSlice = createSlice({
    name: "web",
    initialState,
    reducers: {
        setWebData: (state, action) => {
            state.webData = action.payload;
        },
        setSessionId: (state, action) => {
            state.sessionId = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getWebDataApi.pending, (state, action) => {})
            .addCase(getWebDataApi.fulfilled, (state, action) => {
                if ([200].includes(action?.payload?.status) && action.payload?.data?.data) {
                    state.webData = action.payload?.data?.data;
                }
            })
            .addCase(getWebDataApi.rejected, (state, action) => {
                console.log("getWebDataApi err", action);
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

export const { setWebData, setSessionId } = webSlice.actions;

export default webSlice.reducer;
