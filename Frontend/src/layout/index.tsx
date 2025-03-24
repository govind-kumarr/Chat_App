import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/joy/Box";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const RootLayout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Sidebar />
      <Header />
      <Box component="main" className="MainContent" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default RootLayout;
