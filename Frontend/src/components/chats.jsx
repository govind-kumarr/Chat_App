import React from "react";
import ChatsPane from "./chats-panel";
import { Sheet } from "@mui/joy";

const Chats = () => {
  return (
    <Sheet
      sx={{
        position: { xs: "fixed", sm: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))",
          sm: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 100,
        width: "100%",
        top: 52,
      }}
    >
      <ChatsPane />
    </Sheet>
  );
};

export default Chats;
