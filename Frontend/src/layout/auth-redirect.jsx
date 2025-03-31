import React from "react";
import { authenticateUser } from "../api/actions";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/joy";

const AuthRedirect = ({ children }) => {
  const { data, isLoading, isError } = useQuery({
    queryFn: authenticateUser,
    queryKey: ["authenticateUser"],
    select: (response) => response?.data,
    retry: false,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!isError) return <Navigate to={"/"} />;

  return <>{children}</>;
};

export default AuthRedirect;
