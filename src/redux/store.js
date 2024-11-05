import { applyMiddleware, combineReducers, createStore } from "redux";
import { createMigrate, persistReducer, persistStore } from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";
import appReducer from "./reducer/app";
import { thunk } from "redux-thunk";
import webSlice from "./reducer/webslice";

const migrations = {
    0: (state) => {
        return {
            ...state,
        };
    },
};

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["app", "web"],
    migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
    app: appReducer,
    web: webSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer, applyMiddleware(thunk));

let persistor = persistStore(store);

export { store, persistor };
