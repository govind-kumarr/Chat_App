import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth";
import messangerReducer from "./messanger/messanger";

const store = configureStore({
  reducer: {
    auth: authReducer,
    messanger: messangerReducer,
  },
});

export { store };
