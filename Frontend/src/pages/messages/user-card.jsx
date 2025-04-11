import { Box, Stack, Typography } from "@mui/joy";
import React from "react";
import AvatarWithStatus from "../../components/AvatarWithStatus";

const UserCard = ({ isActive, avatar, name }) => {
  // Replace online, src and name
  return (
    <Stack direction="row" spacing={1.5} alignItems={"center"}>
      <AvatarWithStatus online={true} src={"/static/images/avatar/2.jpg"} />
      <Typography level="title-sm">{"Govind"}</Typography>
    </Stack>
  );
};

export default UserCard;
