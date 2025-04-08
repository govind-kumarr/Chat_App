import { Box, List } from "@mui/joy";
import React from "react";
import SidebarItem from "./sidebar-item";
import { listItemButtonClasses } from "@mui/joy/ListItemButton";
import { useLocation } from "react-router-dom";

const sidebarItemsArr = [
  {
    path: "messages",
    nested: false,
    title: "Messages",
    checkActive: (path) => {
      return ["/", "/messages"].includes(path);
    },
    items: [],
  },
];

const SidebarList = () => {
  const location = useLocation();
  return (
    <Box
      sx={{
        minHeight: 0,
        overflow: "hidden auto",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        [`& .${listItemButtonClasses.root}`]: {
          gap: 1.5,
        },
      }}
    >
      <List
        size="sm"
        sx={{
          gap: 1,
          "--List-nestedInsetStart": "30px",
          "--ListItem-radius": (theme) => theme.vars.radius.sm,
        }}
      >
        {sidebarItemsArr.map((item) => {
          const isActive = item?.checkActive
            ? item?.checkActive(location.pathname)
            : location.pathname === item?.path;
          return <SidebarItem item={item} isActive={isActive} />;
        })}
      </List>
    </Box>
  );
};

export default SidebarList;
