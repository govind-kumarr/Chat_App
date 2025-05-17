import React, { useEffect, useState } from "react";
import {
  isValidIsoString,
  timeConversions,
  toggleMessagesPane,
} from "../../utils";
import {
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
import { socketEventEmitter } from "../../socket/emiitter";

const UserListItem = ({ user }) => {
  const dispatch = useDispatch();
  const {
    chat: { activeChat, unreadCount },
  } = useSelector((state) => state);

  const {
    name,
    email,
    isActive,
    id,
    avatar,
    lastActiveAt = "",
    type,
  } = user || {};

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
            <AvatarWithStatus online={isActive} src={avatar} />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{name}</Typography>
              {/* <Typography level="body-sm">{email}</Typography> */}
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: "right" }}>
              {unreadCount[id] && unreadCount[id]?.unreadMessages > 0 && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: "none", md: "block" } }}
              >
                {isValidIsoString(lastActiveAt)
                  ? timeConversions(new Date(lastActiveAt).getTime())
                  : null}
              </Typography>
            </Box>
          </Stack>
          {/* TODO: <Typography
            level="body-sm"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {"This is test message"}
          </Typography> */}
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </>
  );
};

export default UserListItem;
