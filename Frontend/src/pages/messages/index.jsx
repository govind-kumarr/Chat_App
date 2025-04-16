import React, { useEffect, useRef, useState } from "react";
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
import Profile from "./profile-section";
import MessagesPanelNew from "./messages-panel-new";
import { useQuery } from "@tanstack/react-query";
import { getChats } from "../../api/actions";

const Messages = () => {
  const dispatch = useDispatch();
  const {
    user: { user },
    chat: { activeChat, showProfile, chats },
  } = useSelector((state) => state);

  const { isLoading: chatsLoading, data: chatsResponse } = useQuery({
    queryKey: "getChats",
    queryFn: getChats,
    select: (response) => response?.data?.chats,
    // enabled: chats?.length === 0,
  });

  useEffect(() => {
    SocketService.connect();

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
    if (
      chatsResponse &&
      Array.isArray(chatsResponse) &&
      chatsResponse?.length > 0
    ) {
      dispatch(setChats(chatsResponse));
    }
  }, [chatsResponse]);

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
      {!chatsLoading &&
        chats?.length > 0 &&
        chats?.map((chat) => (
          <MessagesPanelNew key={chat.id} chatId={chat.id} />
        ))}
      {showProfile && <Profile />}
    </Sheet>
  );
};

export default Messages;
