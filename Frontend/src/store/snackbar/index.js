import { createSlice } from "@reduxjs/toolkit";

const defaultSnackbarState = {
  variant: "primary",
  open: false,
  message: "",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: defaultSnackbarState,
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message || "";
      state.variant = action.payload.variant || "primary";
    },
    hideSnackbar: (state, action) => ({ ...defaultSnackbarState }),
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
