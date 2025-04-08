import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./snackbar";
import userReducer from "./user";
import chatReducer from "./chat";

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    user: userReducer,
    chat: chatReducer,
  },
});
