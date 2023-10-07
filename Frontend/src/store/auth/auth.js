import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import decodeToken from "jwt-decode";
import { saveToken, axios } from "../../config/axiosConfig";

const authState = {
  loading: true,
  authenticate: false,
  error: "",
  successMessage: "",
  myInfo: "",
};

const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials) => {
    try {
      const res = await axios.post(
        "http://localhost:3030/api/auth/user-register",
        credentials
      );
      return res.data;
    } catch (error) {
      console.log("Error while registering");
      return error;
    }
  }
);

const loginUser = createAsyncThunk("auth/loginUser", async (credentials) => {
  try {
    const res = await axios.post(
      "http://localhost:3030/api/auth/user-login",
      credentials
    );
    return res.data;
  } catch (error) {
    console.log("Error while registering");
    return error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: authState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.authenticate = false;
        state.myInfo = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { message, access_token } = action.payload;
        saveToken(access_token);
        state.loading = false;
        state.authenticate = true;
        state.successMessage = message;
        state.myInfo = access_token ? decodeToken(access_token) : null;
        toast(message);
      })
      .addCase(registerUser.rejected, (state, action) => {
        const { message } = action.payload;
        state.loading = false;
        state.error = message;
        state.authenticate = false;
        toast(message);
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.authenticate = false;
        state.myInfo = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { message, access_token } = action.payload;
        saveToken(access_token);
        state.loading = false;
        state.error = "";
        state.authenticate = true;
        state.successMessage = message;
        state.myInfo = access_token ? decodeToken(access_token) : null;
        toast(message);
      })
      .addCase(loginUser.rejected, (state) => {
        const { message } = action.payload;
        state.loading = true;
        state.error = message;
        state.authenticate = false;
        state.myInfo = "";
      });
  },
});

export const {} = authSlice.actions;

export { registerUser, loginUser };

export default authSlice.reducer;
