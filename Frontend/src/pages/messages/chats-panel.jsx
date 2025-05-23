import { useState } from "react";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { Box, Chip, IconButton, Input } from "@mui/joy";
import List from "@mui/joy/List";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSelector } from "react-redux";
import UserListItem from "./user-list-item";
import { toggleMessagesPane } from "../../utils";
import ChatListItem from "./chat-list-item";
import CreateGroupModal from "./create-group-modal";

export default function ChatsPane() {
  const [groupModal, setGroupModal] = useState(false);
  const {
    chat: { chats = [] },
    user: { user = {} },
  } = useSelector((state) => state);

  const handleGroupModal = () => {
    setGroupModal(false);
  };

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: { sm: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          pb: 1.5,
        }}
      >
        <Typography
          component="h1"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: "span" } }}
            >
              4
            </Chip>
          }
          sx={{
            fontSize: { xs: "md", md: "lg" },
            fontWeight: "lg",
            mr: "auto",
          }}
        >
          Messages
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          sx={{ display: { xs: "none", sm: "unset" } }}
          onClick={() => setGroupModal(true)}
        >
          <EditNoteRoundedIcon />
        </IconButton>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: "none" } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
        />
      </Box>
      <List
        sx={{
          py: 0,
          "--ListItem-paddingY": "0.75rem",
          "--ListItem-paddingX": "1rem",
        }}
      >
        {chats?.length > 0 &&
          chats?.map((chat) => {
            const { type, id } = chat;
            if (type === "user") return <UserListItem key={id} user={chat} />;
            return <ChatListItem key={id} chat={chat} />;
          })}
      </List>
      <CreateGroupModal open={groupModal} handleClose={handleGroupModal} />
    </Sheet>
  );
}
