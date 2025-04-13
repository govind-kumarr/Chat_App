import React, { useEffect, useState } from "react";
import { Box, Sheet } from "@mui/joy";
import ChatsPanel from "./chats-panel";
import { SocketService } from "../../socket";
import { socketEventEmitter } from "../../socket/emiitter";
import { useDispatch, useSelector } from "react-redux";
import {
  pushMessage,
  setActiveChat,
  setChatMessages,
  setChats,
  setSocketStatus,
} from "../../store/chat";
import MessagePanel from "./message-panel";
import ChatBubble from "../../components/ChatBubble";
import Profile from "./profile-section";

const Messages = () => {
  const dispatch = useDispatch();
  const {
    user: { user },
    chat: { activeChat, chats, activeChatMessages, showProfile },
  } = useSelector((state) => state);

  useEffect(() => {
    SocketService.connect();

    socketEventEmitter.on("chats", (data) => {
      dispatch(setChats(data?.chats));
    });

    socketEventEmitter.on("chat-history", (data) => {
      dispatch(setChatMessages(data));
    });

    socketEventEmitter.on("new-message", (data) => {
      dispatch(pushMessage(data));
    });

    socketEventEmitter.on("connect", (data) => {
      console.log("Connected");
      dispatch(setSocketStatus("connected"));
    });

    socketEventEmitter.on("reconnect", (data) => {
      console.log("Re-Connected");
      dispatch(setSocketStatus("connected"));
    });
    socketEventEmitter.on("reconnect_attempt", (data) => {
      dispatch(setSocketStatus("reconnecting"));
      console.log("Reconnecting...");
    });
    socketEventEmitter.on("disconnect", (data) => {
      dispatch(setSocketStatus("disconnected"));
      console.log("Disconnected");
    });
  }, []);

  useEffect(() => {
    if (activeChat) SocketService.getChatHistory(activeChat);
  }, [activeChat]);

  useEffect(() => {
    console.log({ chats });
    if (chats?.length > 0 && !activeChat) {
      const [chat] = chats.filter((c) => c?.id != user?.id);
      dispatch(setActiveChat(chat?.id));
    }
  }, [chats]);

  return (
    <Sheet
      sx={{
        flex: 1,
        // width: "100%",
        mx: "auto",
        pt: { xs: "var(--Header-height)", md: 0 },
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: showProfile
            ? "1fr minmax(min-content, min(30%, 500px))"
            : "minmax(min-content, min(30%, 100px)) 1fr",
        },
      }}
    >
      {!showProfile && <ChatsPanel />}
      {chats?.length > 0 &&
        activeChat &&
        chats?.map((chat) => {
          return (
            <MessagePanel
              key={chat.id}
              chat={chat}
              chatMessages={chat.id === activeChat ? activeChatMessages : []}
              show={chat.id === activeChat}
            />
          );
        })}
      {showProfile && <Profile />}
    </Sheet>
  );
};

export default Messages;
