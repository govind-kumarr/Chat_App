import { Box, Stack, Typography } from "@mui/joy";
import React from "react";
import AvatarWithStatus from "../../components/AvatarWithStatus";

const UserCard = ({ isActive, avatar, name }) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems={"center"}>
      <AvatarWithStatus online={isActive} src={avatar} />
      <Typography level="title-sm">{name}</Typography>
    </Stack>
  );
};

export default UserCard;
