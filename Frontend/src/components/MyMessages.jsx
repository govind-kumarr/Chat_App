import { useEffect, useState } from "react";
import Sheet from "@mui/joy/Sheet";

import MessagesPane from "./MessagesPane";
import ChatsPane from "./chats-panel";
import { chats } from "../data";
import { SocketService } from "../socket";
import { socketEventEmitter } from "../socket/emiitter";
import Chats from "./chats";

export default function MyProfile() {
  // const [selectedChat, setSelectedChat] = useState(chats[0]);
  useEffect(() => {
    SocketService.connect();
    socketEventEmitter.on("active-users", (data) => {
      // console.log("active-users", { data });
    });
    socketEventEmitter.on("chats", (data) => {
      // console.log("chats", { data });
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
      <Chats />
      {/* <MessagesPane chat={selectedChat} /> */}
    </Sheet>
  );
}
