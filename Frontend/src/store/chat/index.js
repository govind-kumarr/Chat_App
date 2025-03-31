import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  chats: [],
  activeChat: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState: defaultState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const { setChats } = chatSlice.actions;

export default chatSlice.reducer;
