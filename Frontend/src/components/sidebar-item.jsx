import {
  Link,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from "@mui/joy";
import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const SidebarItem = ({ item = {}, isActive = false }) => {
  const { path, nested, title, items } = item;
  const navigate = useNavigate();

  if (nested) {
    return null;
  }

  return (
    <ListItem>
      <ListItemButton selected={isActive} onClick={() => navigate(path)}>
        <HomeRoundedIcon />
        <ListItemContent>
          <Typography level="title-sm">{title}</Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem;
