import { Avatar, Stack, Typography } from "@mui/joy";
import React, { useState } from "react";
import { fileTypeMap } from "../constants";
import { checkFileType, handleDownload, sizeConversions } from "../utils";

const FileDetails = ({ fileDetails }) => {
  const [downloaded, setDownloaded] = useState(false);
  const handleDownloadComplete = () => {
    setDownloaded(true);
  };
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Avatar
        color="primary"
        size="lg"
        onClick={() => {
          if (!downloaded) handleDownload(fileDetails, handleDownloadComplete);
        }}
        sx={{ cursor: "pointer" }}
      >
        {fileTypeMap[checkFileType(fileDetails?.mimeType)]}
      </Avatar>
      <div>
        <Typography sx={{ fontSize: "sm" }}>
          {fileDetails.originalFileName}
        </Typography>
        <Typography level="body-sm">
          {sizeConversions(fileDetails.size)}
        </Typography>
      </div>
    </Stack>
  );
};

export default FileDetails;
