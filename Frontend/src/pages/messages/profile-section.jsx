import { Avatar, Stack, Typography } from "@mui/joy";
import React from "react";
import { useSelector } from "react-redux";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import FilesList from "./files-list";
import ImagesList from "./images-list";
import MemberList from "./member-list";

const tabs = [
  {
    label: "Files",
    value: "files",
  },
  {
    label: "Images",
    value: "images",
  },
];

const Profile = () => {
  const {
    chat: { activeChat, chats, activeChatMessages },
  } = useSelector((state) => state);
  const chat = chats?.find((c) => c?.id === activeChat) || {};

  return (
    <Stack sx={{ maxWidth: "500px" }} direction={"column"}>
      <Stack
        direction="column"
        spacing={{ xs: 1, md: 2 }}
        sx={{
          alignItems: "center",
          margin: "auto",
          height: "100%",
          maxHeight: "150px",
          p: 4,
        }}
      >
        <Avatar size="lg" src={chat?.avatar} />
        <Typography level="body-sm">{chat?.name}</Typography>
      </Stack>
      <Tabs
        aria-label="Basic tabs"
        defaultValue={"files"}
        sx={{
          flex: 1,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <TabList sticky="top">
          {chat.type === "group" && (
            <Tab value={"group"} sx={{ width: "100%" }}>
              Members
            </Tab>
          )}
          {tabs.map(({ label, value }) => (
            <Tab value={value} sx={{ width: "100%" }}>
              {label}
            </Tab>
          ))}
        </TabList>
        {chat.type === "group" && (
          <TabPanel value={"group"} sx={{ width: "100%" }}>
            <MemberList chatId={activeChat} />
          </TabPanel>
        )}

        <TabPanel value={"files"}>
          <FilesList
            files={activeChatMessages?.filter(
              (message) => message?.type === "media"
            )}
          />
        </TabPanel>
        <TabPanel value={"images"}>
          <ImagesList
            images={activeChatMessages?.filter(
              (message) =>
                message?.type === "media" &&
                message?.fileDetails?.mimeType?.includes("image")
            )}
          />
        </TabPanel>
      </Tabs>
    </Stack>
  );
};

export default Profile;
