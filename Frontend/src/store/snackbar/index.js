import { createSlice } from "@reduxjs/toolkit";

const defaultSnackbarState = {
  variant: "primary",
  open: false,
  title: "",
  description: "",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: defaultSnackbarState,
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.title = action.payload.title || "";
      state.description = action.payload.description || "";
      state.variant = action.payload.variant || "primary";
    },
    hideSnackbar: (state, action) => ({ ...defaultSnackbarState }),
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
