import { Box, Divider, Sheet, Stack } from "@mui/joy";
import React from "react";
import MessageInput from "./message-input";
import MessagesPaneHeader from "./message-panel-header";
import { useSelector } from "react-redux";
import ChatBubble from "../../components/ChatBubble";
import AvatarWithStatus from "../../components/AvatarWithStatus";
import { getGroupMessages } from "../../utils";

const MessagePanel = () => {
  const {
    user: { user },
    chat: { activeChat, activeChatMessages },
  } = useSelector((state) => state);
  const groupedMessages = getGroupMessages(activeChatMessages);

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
            Object.keys(groupedMessages).map((date) => {
              const messages = groupedMessages[date];
              return (
                <>
                  <Divider>{date}</Divider>
                  {messages?.length > 0 &&
                    messages.map((message, index) => {
                      const { sender } = message;
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
                            sender={isYou ? "You" : sender}
                          />
                        </Stack>
                      );
                    })}
                </>
              );
            })}
        </Stack>
      </Box>
      <MessageInput />
    </Sheet>
  );
};

export default MessagePanel;
