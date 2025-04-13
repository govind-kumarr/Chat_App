import { Avatar, Button, Chip, IconButton, Stack, Typography } from "@mui/joy";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import React from "react";
import { toggleMessagesPane } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setShowProfile } from "../../store/chat";

const MessagePanelHeader = () => {
  const {
    chat: { activeChat, chats, showProfile },
  } = useSelector((state) => state);
  const dispatch = useDispatch();

  const {
    name,
    email,
    isActive,
    avatar,
    lastActive = "", // Calc duration
    type,
  } = chats?.find((c) => c.id === activeChat) || {};

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: "center" }}
      >
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar size="lg" src={avatar} />
        <div>
          <Typography
            component="h2"
            noWrap
            endDecorator={
              type !== "group" ? (
                <Chip
                  variant="outlined"
                  size="sm"
                  color="neutral"
                  sx={{ borderRadius: "sm" }}
                  startDecorator={
                    <CircleIcon
                      sx={{ fontSize: 8 }}
                      color={isActive ? "success" : "disabled"}
                    />
                  }
                  slotProps={{ root: { component: "span" } }}
                >
                  {isActive ? "online" : "offline"}
                </Chip>
              ) : undefined
            }
            sx={{ fontWeight: "lg", fontSize: "lg" }}
          >
            {name}
          </Typography>
          <Typography level="body-sm">{email}</Typography>
        </div>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
        <Button
          startDecorator={<PhoneInTalkRoundedIcon />}
          color="neutral"
          variant="outlined"
          size="sm"
          sx={{ display: { xs: "none", md: "inline-flex" } }}
        >
          Call
        </Button>
        <Button
          color="neutral"
          variant="outlined"
          size="sm"
          sx={{ display: { xs: "none", md: "inline-flex" } }}
          onClick={() => {
            dispatch(setShowProfile(!showProfile));
          }}
        >
          {showProfile ? "Hide" : "View"} profile
        </Button>
        <IconButton size="sm" variant="plain" color="neutral">
          <MoreVertRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default MessagePanelHeader;
