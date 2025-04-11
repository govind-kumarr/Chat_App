import React, { useRef, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Textarea from "@mui/joy/Textarea";
import {
  IconButton,
  Modal,
  ModalClose,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useSelector } from "react-redux";
import { SocketService } from "../../socket";
import VisuallyHiddenInput from "../../components/VisuallyHiddenInput";
import { changeUploadStatus, uploadFile } from "../../api/actions";
import useAppMutation from "../../hooks/useAppMutation";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // Add colorfull icons for file types

const FileInput = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);

  const inputRef = useRef(null);

  const {
    mutateAsync: changeUploadStatusMutate,
    isPending: uploadStatusPending,
  } = useAppMutation({
    mutationFn: changeUploadStatus,
    mutationKey: "changeUploadStatus",
  });

  const {
    chat: { activeChat, chats },
  } = useSelector((state) => state);
  const handleMessageSend = (text) => {
    if (!text || !activeChat) {
      return;
    }
    setSending(true);

    const chat = chats.find((c) => c.id === activeChat);
    if (chat) {
      const { type } = chat;
      const sendMessagePayload = {
        content: text,
        type,
        ...(type === "user"
          ? { recipientId: activeChat }
          : { chatId: activeChat }),
      };

      SocketService.sendMessage(sendMessagePayload, (res) => {
        console.log("Text message sent", res);
        setSending(false);
      });
      setText("");
    }
  };

  const handleFileSelect = (e) => {
    const [file] = e.target.files;
    if (file) {
      setFile(file);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setFile(null);
    setOpen(false);
  };

  const handleFileClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleMessageSend(text);
    }
  };

  const handleFileSend = (file) => {
    setSending(true);
    const chat = chats.find((c) => c.id === activeChat);
    if (chat) {
      const { type } = chat;
      SocketService.sendMessage(
        {
          [type === "user" ? "recipientId" : "chatId"]: activeChat,
          messageType: "media",
          fileInfo: {
            fileName: file?.name,
            size: file?.size,
            type: "",
            mimeType: file?.type,
          },
        },
        async (res) => {
          try {
            const { data = {} } = res;
            const { url, fileId } = data;
            const response = await uploadFile(url, file, file.type);
            if (response.status === 200) {
              await changeUploadStatusMutate({ fileId });
            }
            console.log("File message sent", res);
          } catch (error) {
            console.log(`Error sending file message ${error?.message}`);
          } finally {
            setOpen(false);
            setSending(false);
          }
        }
      );
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <Box sx={{ width: "100%" }} borderRadius={"10px"}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
            py: 1,
            pr: 1,
            // borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction={"row"}>
            <IconButton
              size="lg"
              variant="plain"
              color="neutral"
              onClick={handleFileClick}
              // sx={{border: '1px solid grey'}}
            >
              <PictureAsPdfIcon />
            </IconButton>
            <Stack direction={"column"}>
              <Typography level="body-sm">{"file name here"}</Typography>
            </Stack>
          </Stack>
          <Button
            size="sm"
            color="primary"
            sx={{ alignSelf: "center", borderRadius: "sm" }}
            endDecorator={<SendRoundedIcon />}
            onClick={() => handleMessageSend(text)}
            disabled={!text || sending}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default FileInput;
