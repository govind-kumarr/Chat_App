import { Box, Divider, Sheet, Stack, Typography } from "@mui/joy";
import React from "react";
import MessageInput from "./message-input";
import MessagesPaneHeader from "./message-panel-header";
import { useSelector } from "react-redux";
import ChatBubble from "../../components/ChatBubble";
import AvatarWithStatus from "../../components/AvatarWithStatus";
import { getGroupMessages } from "../../utils";

const MessagePanel = ({ chat, chatMessages, show }) => {
  if (!show) return null;

  const { user } = useSelector((state) => state.user);
  const groupedMessages = chatMessages ? getGroupMessages(chatMessages) : {};

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <>
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
          {Object.keys(groupedMessages).length > 0 ? (
            <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
              {Object.keys(groupedMessages).map((date) => {
                const messages = groupedMessages[date];
                return (
                  <>
                    <Divider>{date}</Divider>
                    {messages?.length > 0 &&
                      messages.map((message, index) => {
                        const { isActive, avatar, senderName } = message;
                        const isYou = message?.senderId === user?.id;
                        return (
                          <Stack
                            key={index}
                            direction="row"
                            spacing={2}
                            sx={{
                              flexDirection: isYou ? "row-reverse" : "row",
                            }}
                          >
                            {!isYou && (
                              <AvatarWithStatus
                                online={isActive}
                                src={avatar}
                              />
                            )}
                            <ChatBubble
                              variant={isYou ? "sent" : "received"}
                              {...message}
                              sender={isYou ? "You" : senderName}
                            />
                          </Stack>
                        );
                      })}
                  </>
                );
              })}
            </Stack>
          ) : (
            <Stack
              spacing={2}
              sx={{
                justifyContent: "center",
                width: "100%",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Typography level="title-lg">No Messages</Typography>
            </Stack>
          )}
        </Box>
        <MessageInput />
      </>
    </Sheet>
  );
};

export default MessagePanel;
