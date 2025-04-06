import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";

import ColorSchemeToggle from "./ColorSchemeToggle";
import { closeSidebar } from "../utils";
import { logoutUser } from "../api/actions";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarList from "./sidebar-list";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const navigate = useNavigate();
  const {
    user: { user = {} },
  } = useSelector((state) => state);

  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutUser,
    mutationKey: "logoutUser",
    onSuccess: (response) => {
      console.log({ response });
      navigate("/auth");
    },
  });

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">Acme Co.</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      {/* <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
      /> */}
      <SidebarList />
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar
          variant="outlined"
          size="sm"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{user?.username || ""}</Typography>
          <Typography level="body-xs">{user?.email || ""}</Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          disabled={isLoggingOut}
          onClick={() => logoutMutate()}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
