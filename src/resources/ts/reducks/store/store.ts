import { configureStore } from "@reduxjs/toolkit";
import analysisReducer from "./slice";  // reducerをimport

export const store = configureStore({
  reducer: {
    analysis: analysisReducer, // reducerを追加
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'analysis/updatePhoto', // この action に対しては serializableCheck しない
        ]
      },
    }),
});