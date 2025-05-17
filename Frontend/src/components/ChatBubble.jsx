import { useState } from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getFormattedDate } from "../utils";
import FileDetails from "./file-details";

export default function ChatBubble(props) {
  const { content, variant, createdAt, fileDetails = {}, type, sender } = props;
  const isSent = variant === "sent";
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCelebrated, setIsCelebrated] = useState(false);

  return (
    <Box sx={{ maxWidth: "60%", minWidth: "auto" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", mb: 0.25 }}
      >
        <Typography level="body-xs">
          {sender === "You" ? sender : sender}
        </Typography>
        <Typography level="body-xs">
          {getFormattedDate(createdAt, "HH:MM A")}
        </Typography>
      </Stack>
      {type === "media" ? (
        <Sheet
          variant="outlined"
          sx={[
            {
              px: 1.75,
              py: 1.25,
              borderRadius: "lg",
            },
            isSent
              ? { borderTopRightRadius: 0 }
              : { borderTopRightRadius: "lg" },
            isSent ? { borderTopLeftRadius: "lg" } : { borderTopLeftRadius: 0 },
          ]}
        >
          <FileDetails key={fileDetails?._id} fileDetails={fileDetails} />
        </Sheet>
      ) : (
        <Box
          sx={{ position: "relative" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sheet
            color={isSent ? "primary" : "neutral"}
            variant={isSent ? "solid" : "soft"}
            sx={[
              {
                p: 1.25,
                borderRadius: "lg",
              },
              isSent
                ? {
                    borderTopRightRadius: 0,
                  }
                : {
                    borderTopRightRadius: "lg",
                  },
              isSent
                ? {
                    borderTopLeftRadius: "lg",
                  }
                : {
                    borderTopLeftRadius: 0,
                  },
              isSent
                ? {
                    backgroundColor: "var(--joy-palette-primary-solidBg)",
                  }
                : {
                    backgroundColor: "background.body",
                  },
            ]}
          >
            <Typography
              level="body-sm"
              sx={[
                isSent
                  ? {
                      color: "var(--joy-palette-common-white)",
                    }
                  : {
                      color: "var(--joy-palette-text-primary)",
                    },
              ]}
            >
              {content}
            </Typography>
          </Sheet>
        </Box>
      )}
    </Box>
  );
}
