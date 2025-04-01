import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  chats: [],
  activeChat: "",
  activeChatMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState: defaultState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setChatMessages: (state, action) => {
      state.activeChatMessages = action.payload;
    },
  },
});

export const { setChats, setActiveChat, setChatMessages } = chatSlice.actions;

export default chatSlice.reducer;
