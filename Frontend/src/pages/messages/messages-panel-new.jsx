import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Box, Divider, Sheet, Stack, Typography } from "@mui/joy";
import { useSelector } from "react-redux";

import MessagesPaneHeader from "./message-panel-header";
import { getChatMessages } from "../../api/actions";
import { getGroupMessages } from "../../utils";
import MessageInput from "./message-input";
import AvatarWithStatus from "../../components/AvatarWithStatus";
import ChatBubble from "../../components/ChatBubble";

const MessagesPanelNew = ({ chatId }) => {
  const [allMessages, setAllMessages] = useState([]);
  const {
    user: { user },
    chat: { activeChat },
  } = useSelector((state) => state);

  const messageContainerRef = useRef(null);
  const { isPending, mutate: getChatMessageMutate } = useMutation({
    mutationFn: getChatMessages,
    mutationKey: "getChatMessages",
    onSuccess: (response) => {
      setAllMessages((prev) => [...prev, ...(response?.data?.messages || [])]);
    },
  });

  const groupedMessages =
    !isPending && allMessages ? getGroupMessages(allMessages) : {};

  const fetchNextBatch = () => {
    const offset = allMessages.length;
    getChatMessageMutate({
      offset,
      chatId,
    });
  };

  useEffect(() => {
    if (!allMessages?.length) {
      getChatMessageMutate({ chatId });
    }

    const el = messageContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop } = el;
      if (scrollTop <= 10) {
        // fetchNextBatch();
      }
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        display: chatId === activeChat ? "flex" : "none",
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
            overflowY: "auto",
            flexDirection: "column",
          }}
          ref={messageContainerRef}
        >
          {Object.keys(groupedMessages).length > 0 ? (
            <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
              {Object.keys(groupedMessages).map((date) => {
                const messages = groupedMessages[date];
                return (
                  <React.Fragment key={date}>
                    <Divider>{date}</Divider>
                    {messages?.length > 0 &&
                      messages.map((message, index) => {
                        const { isActive, avatar, senderName } = message;
                        const isYou = message?.senderId === user?.id;
                        return (
                          <Stack
                            key={message?.id}
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
                  </React.Fragment>
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

export default React.memo(MessagesPanelNew);
