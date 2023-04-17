import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice";  // reducerをimport

export const store = configureStore({
  reducer: {
    cart: cartReducer, // reducerを追加
  },
});