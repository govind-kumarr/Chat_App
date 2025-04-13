import React from "react";
import {
  isValidIsoString,
  timeConversions,
  toggleMessagesPane,
} from "../../utils";
import {
  Avatar,
  Box,
  ListDivider,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/joy";
import AvatarWithStatus from "../../components/AvatarWithStatus";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../store/chat";

const ChatListItem = ({ chat }) => {
  const dispatch = useDispatch();

  const {
    name,
    email,
    isActive,
    id,
    avatar,
    lastActiveAt = "",
    type,
    lastMessageAt = "",
    lastMessageType = "",
    lastMessageContent = "",
  } = chat || {};
  const {
    chat: { activeChat },
  } = useSelector((state) => state);

  return (
    <>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            dispatch(setActiveChat(id));
          }}
          selected={activeChat === id}
          color="neutral"
          sx={{ flexDirection: "column", alignItems: "initial", gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            {type === "personal" ? (
              <AvatarWithStatus online={isActive} src={avatar} />
            ) : (
              <Avatar size="sm" />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{name}</Typography>
              <Typography level="body-sm" whiteSpace={"nowrap"}>
                {lastMessageContent?.length > 20
                  ? `${lastMessageContent.slice(0, 18)}...`
                  : lastMessageContent}
              </Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: "right" }}>
              {/* {messages[0].unread && (
            <CircleIcon sx={{ fontSize: 12 }} color="primary" />
          )} */}
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: "none", md: "block" } }}
              >
                {lastMessageAt && isValidIsoString(lastMessageAt)
                  ? timeConversions(new Date(lastMessageAt).getTime())
                  : null}
              </Typography>
            </Box>
          </Stack>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </>
  );
};

export default ChatListItem;
