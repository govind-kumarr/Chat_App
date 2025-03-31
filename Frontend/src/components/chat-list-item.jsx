import React from "react";
import { toggleMessagesPane } from "../utils";
import {
  Box,
  ListDivider,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/joy";
import AvatarWithStatus from "./AvatarWithStatus";
import CircleIcon from "@mui/icons-material/Circle";

const ChatListItem = () => {
  return (
    <>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            // setSelectedChat({ id, sender, messages });
          }}
          selected={true}
          color="neutral"
          sx={{ flexDirection: "column", alignItems: "initial", gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus
              online={true}
              src={"/static/images/avatar/2.jpg"}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{"Test"}</Typography>
              <Typography level="body-sm">{"Test"}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: "right" }}>
              {/* {messages[0].unread && ( */}
              <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              {/* )} */}
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: "none", md: "block" } }}
              >
                5 mins ago
              </Typography>
            </Box>
          </Stack>
          <Typography
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
            {/* {messages[0].content} */}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </>
  );
};

export default ChatListItem;
