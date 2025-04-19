import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  IconButton,
  MenuButton,
  Stack,
  Typography,
  Menu,
  MenuItem,
} from "@mui/joy";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import React from "react";
import { toggleMessagesPane } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setShowProfile } from "../../store/chat";
import MoreVert from "@mui/icons-material/MoreVert";
import { deleteChat } from "../../api/actions";
import useAppMutation from "../../hooks/useAppMutation";
import { useQueryClient } from "@tanstack/react-query";

const MessagePanelHeader = () => {
  const queryClient = useQueryClient();
  const {
    chat: { activeChat, chats, showProfile },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { isPending: deletingGroup, mutate: deleteChatMutate } = useAppMutation(
    {
      mutationFn: deleteChat,
      mutationKey: "deleteChat",
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["getChats"],
          exact: false,
        });
      },
    }
  );

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
        <Dropdown>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{ root: { variant: "outlined", color: "neutral" } }}
          >
            <MoreVert />
          </MenuButton>
          <Menu placement="bottom-start">
            {type === "group" && (
              <MenuItem
                onClick={() => {
                  deleteChatMutate({ chatId: activeChat });
                }}
                disabled={deletingGroup}
              >
                Delete Group
              </MenuItem>
            )}
          </Menu>
        </Dropdown>
      </Stack>
    </Stack>
  );
};

export default MessagePanelHeader;
