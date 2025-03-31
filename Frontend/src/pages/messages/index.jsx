import React, { useEffect } from "react";
import { Sheet } from "@mui/joy";
import ChatsPanel from "./chats-panel";
import { SocketService } from "../../socket";
import { socketEventEmitter } from "../../socket/emiitter";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "../../store/chat";
import MessagePanel from "./message-panel";

const Messages = () => {
  const dispatch = useDispatch();
  const {
    user: { user },
  } = useSelector((state) => state);
  console.log({ user });

  useEffect(() => {
    SocketService.connect();
    socketEventEmitter.on("active-users", (data) => {
      // console.log("active-users", { data });
    });
    socketEventEmitter.on("chats", (data) => {
      dispatch(setChats(data?.chats));
      // console.log("chats", { data });
      // if (Array.isArray(data?.chats) && user) {
      //   const payload = data?.chats?.filter((c) => c.id !== user?.id);
      //   dispatch(setChats(payload));
      // }
    });
  }, []);

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
      {/* <MessagesPane chat={selectedChat} /> */}
    </Sheet>
  );
};

export default Messages;
