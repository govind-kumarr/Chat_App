import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  chats: [],
  activeChat: "",
  activeChatMessages: [],
  socketStatus: "connecting",
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
    setSocketStatus: (state, action) => {
      state.socketStatus = action.payload;
    },
    setChatMessages: (state, action) => {
      state.activeChatMessages = action.payload;
    },
    pushMessage: (state, action) => {
      state.activeChatMessages = [
        ...(state.activeChatMessages || []),
        action.payload,
      ];
    },
  },
});

export const {
  setChats,
  setActiveChat,
  setChatMessages,
  pushMessage,
  setSocketStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
