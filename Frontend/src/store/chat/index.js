import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
  chats: [],
  activeChat: "",
  activeChatMessages: [],
  users: [],
  selectedUser: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState: defaultState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setActiveChat: (state, action) => {
      state.selectedUser = "";
      state.activeChat = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.activeChat = "";
      state.selectedUser = action.payload;
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
  setUsers,
  setSelectedUser,
} = chatSlice.actions;

export default chatSlice.reducer;
