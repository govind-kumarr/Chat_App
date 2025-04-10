import React, { useEffect } from "react";
import { Sheet } from "@mui/joy";
import ChatsPanel from "./chats-panel";
import { SocketService } from "../../socket";
import { socketEventEmitter } from "../../socket/emiitter";
import { useDispatch, useSelector } from "react-redux";
import {
  pushMessage,
  setActiveChat,
  setChatMessages,
  setChats,
  setUsers,
} from "../../store/chat";
import MessagePanel from "./message-panel";

const Messages = () => {
  const dispatch = useDispatch();
  const {
    user: { user },
    chat: { activeChat, chats },
  } = useSelector((state) => state);
  // console.log({ user, chats, activeChat });

  useEffect(() => {
    SocketService.connect();

    socketEventEmitter.on("chats", (data) => {
      dispatch(setChats(data?.chats));
      dispatch(setUsers(data?.users));
    });

    socketEventEmitter.on("chat-history", (data) => {
      dispatch(setChatMessages(data));
    });

    socketEventEmitter.on("new-message", (data) => {
      dispatch(pushMessage(data));
    });
  }, []);

  useEffect(() => {
    if (activeChat) SocketService.getChatHistory(activeChat);
  }, [activeChat]);

  useEffect(() => {
    if (chats?.length > 0 && !activeChat) {
      const [chat] = chats.filter((c) => c?.id != user?.id);
      dispatch(setActiveChat(chat?.id));
    }
  }, [chats]);

  return (
    <Sheet
      sx={{
        flex: 1,
        width: "100%",
        mx: "auto",
        pt: { xs: "var(--Header-height)", md: 0 },
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(min-content, min(30%, 400px)) 1fr",
        },
      }}
    >
      <ChatsPanel />
      <MessagePanel />
    </Sheet>
  );
};

export default Messages;
