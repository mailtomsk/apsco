import { configureStore, combineReducers } from "@reduxjs/toolkit";
import customerAuthReducer from "./auth/customerAuthSlice";
import adminAuthReducer from './auth/adminAuthSlice';
import bookingReducer from "./auth/bookingSlice";
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from "redux-persist";

const persistConfig: any = {
    key: "root",
    storage,
    whitelist: ["customerAuth", "adminAuth", "booking"], // Only persist the auth slice
    serialize: true,
    deserialize: true,
};


const rootReducer = combineReducers({
    customerAuth: customerAuthReducer,
    adminAuth: adminAuthReducer,
    booking: bookingReducer
});

/* export const store = configureStore({
    reducer: {
        customerAuth: customerAuthReducer, // global State customerAuth:{token, user, loading, error}
        adminAuth: adminAuthReducer
    }
}); */

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer:{
        auth:persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false// Required to avoid serialization errors
    }),
    devTools: import.meta.env.APP_ENV !== "production",
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;