import React, { useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { geteUserInfo } from "../api/actions";
import { useDispatch } from "react-redux";
import { setUser } from "../store/user";

const UserProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isError, data } = useQuery({
    queryFn: geteUserInfo,
    queryKey: ["geteUserInfo"],
    retry: false,
    select: (response) => response.data,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && data) {
      dispatch(setUser(data?.user));
    }
  }, [isLoading, data]);

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

  if (isError) return <Navigate to={"/login"} />;

  return <>{children}</>;
};

export default UserProvider;
