import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer from "./reducer/authReducer";

// Safe-check storage to handle Next.js Server-Side Rendering (SSR) without warnings
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// Use real storage on the client, and noop storage on the server
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const rootReducer = combineReducers({
  authStore: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authStore"], // persist only auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
