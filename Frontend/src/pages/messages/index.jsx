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
  setSocketStatus,
} from "../../store/chat";
import MessagePanel from "./message-panel";

const Messages = () => {
  const dispatch = useDispatch();
  const {
    user: { user },
    chat: { activeChat, chats, activeChatMessages },
  } = useSelector((state) => state);
  // console.log({ user, chats, activeChat });

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
      {chats?.length > 0 &&
        chats?.map((chat) => {
          if (chat.id === activeChat)
            return (
              <MessagePanel
                key={chat.id}
                chat={activeChat}
                chatMessages={activeChatMessages}
              />
            );
        })}
      <MessagePanel />
    </Sheet>
  );
};

export default Messages;
