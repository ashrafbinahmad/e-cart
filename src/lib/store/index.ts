// store.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import { loadState } from "./browserStorage";

const reducers = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

export const store = configureStore({
  reducer: reducers,
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
