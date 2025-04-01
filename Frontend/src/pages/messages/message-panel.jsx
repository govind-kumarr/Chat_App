import { Box, Sheet, Stack } from "@mui/joy";
import React from "react";
import MessageInput from "./message-input";
import MessagesPaneHeader from "./message-panel-header";
import { useSelector } from "react-redux";
import ChatBubble from "../../components/ChatBubble";

const MessagePanel = () => {
  const {
    user: { user },
    chat: { chats, activeChat, activeChatMessages },
  } = useSelector((state) => state);
  const sender = chats?.find((c) => c.id === activeChat);
  console.log({ activeChat, activeChatMessages });

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
          {activeChat &&
            activeChatMessages?.length > 0 &&
            activeChatMessages.map((message, index) => {
              const isYou = message?.senderId === user?.id;
              return (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
                >
                  {!isYou && (
                    <AvatarWithStatus
                      online={sender.isActive}
                      src={sender.avatar}
                    />
                  )}
                  <ChatBubble
                    variant={isYou ? "sent" : "received"}
                    {...message}
                  />
                </Stack>
              );
            })}
        </Stack>
      </Box>
      <MessageInput />
    </Sheet>
  );
};

export default MessagePanel;
