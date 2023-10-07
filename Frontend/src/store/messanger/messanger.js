import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  axios } from "../../config/axiosConfig";


const messengerState = {
  friends: [],
  messages: [],
  mesageSendSuccess: false,
  message_get_success: false,
  themeMood: "",
  new_user_add: "",
  loading: false,
  error: false,
  successMessage: "",
  errorMessage: "",
  activeUser: "",
  mySocketId: "",
  isTyping: false,
};

const getFriends = createAsyncThunk("messanger/getFriends", async () => {
  try {
    const response = await axios.get("/api/friends");
    return response.data;
  } catch (error) {
    console.log("Error getting friends", error);
  }
});

const saveMessageToDB = createAsyncThunk(
  "messanger/saveMessageToDB",
  async (message) => {
    try {
      const response = await axios.post(
        "/api/chat/message",
        { ...message }
      );
      return response.data;
    } catch (error) {
      console.log("Error getting friends", error);
    }
  }
);

const getMessagesFromDB = createAsyncThunk(
  "messanger/getMessagesFromDB",
  async () => {
    try {
      const response = await axios("/api/chat");
      return response.data;
    } catch (error) {
      console.log("Error getting messages", error);
    }
  }
);

const messangerSlice = createSlice({
  name: "messanger",
  initialState: messengerState,
  reducers: {
    loadMessages: (state, action) => {
      state.messages = action.payload;
    },
    addNewMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    addMyMessage: (state, action) => {
      const { receiver } = action.payload;
      state[receiver] = [...state[receiver], action.payload];
    },
    addRecievedMessage: (state, action) => {
      const { sender } = action.payload;
      state[sender] = [...state[sender], action.payload];
    },
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },
    setMySocketId: (state, action) => {
      state.mySocketId = action.payload;
    },
    setMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find((m) => m.messageId === messageId);
      message.status = status;
    },
    changeTyping: (state, action) => {
      state.isTyping = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        const friends = action.payload;
        state.friends = friends;
        state.loading = false;
        state.successMessage = "Successfully got friends";
        state.error = false;
      })
      .addCase(getFriends.rejected, (state) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = "Failed to get friends";
      })
      .addCase(saveMessageToDB.pending, (state) => {
        console.log("Saving message to database");
      })
      .addCase(saveMessageToDB.fulfilled, (state, action) => {
        console.log(action.payload);
      })
      .addCase(saveMessageToDB.rejected, (state, action) => {
        console.log(
          "Saving message to database failed with error: " + action.payload
        );
      })
      .addCase(getMessagesFromDB.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const {
  loadMessages,
  addNewMessage,
  setActiveUser,
  addRecievedMessage,
  addMyMessage,
  setMySocketId,
  setMessageStatus,
  changeTyping,
} = messangerSlice.actions;
export { getFriends, saveMessageToDB, getMessagesFromDB };
export default messangerSlice.reducer;
