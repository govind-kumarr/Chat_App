import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authenticateUser } from "../api/actions";
import { Box, Typography } from "@mui/joy";
import { Navigate } from "react-router-dom";

const AuthLayout = ({ children }) => {
  const { isLoading, isError } = useQuery({
    queryFn: authenticateUser,
    queryKey: ["authenticateUser"],
    retry: false,
    refetchOnWindowFocus: false,
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

  if (isError) return <Navigate to={"/auth"} />;

  return <>{children}</>;
};

export default AuthLayout;
