import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getGroupMembers } from "../../api/actions";
import { Box, Chip, Stack, Typography } from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";

const MemberList = ({ chatId }) => {
  const { data: group } = useQuery({
    queryKey: ["getGroupMembers", { chatId }],
    queryFn: ({ queryKey }) => getGroupMembers(queryKey[1]),
    select: (response) => response?.data?.members,
    gcTime: Infinity,
  });
  console.log({ group });

  return (
    <Stack>
      {group?.members?.length > 0 ? (
        <List>
          {group?.members?.map((member) => {
            return (
              <ListItem>
                <ListItemContent>
                  <Box sx={{ display: "flex", gap: "5px" }}>
                    <Typography>{member?.username}</Typography>
                    {group?.admin?.includes(member?._id) && (
                      <Chip
                        variant="soft"
                        color="primary"
                        size="md"
                        slotProps={{ root: { component: "span" } }}
                      >
                        admin
                      </Chip>
                    )}
                  </Box>
                </ListItemContent>
              </ListItem>
            );
          })}
        </List>
      ) : null}
    </Stack>
  );
};

export default MemberList;
