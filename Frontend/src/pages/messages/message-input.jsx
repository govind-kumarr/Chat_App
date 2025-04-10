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

const MessageInput = () => {
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
      <FormControl>
        <Textarea
          placeholder="Type something here…"
          aria-label="Message"
          minRows={3}
          maxRows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          endDecorator={
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                flexGrow: 1,
                py: 1,
                pr: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <div>
                <IconButton
                  size="sm"
                  variant="plain"
                  color="neutral"
                  onClick={handleFileClick}
                >
                  <AttachFileIcon />
                </IconButton>
                <VisuallyHiddenInput
                  type="file"
                  ref={inputRef}
                  onChange={handleFileSelect}
                />
              </div>
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
          }
          sx={{
            "& textarea:first-of-type": {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 2 }} />
          {file && (
            <Box
              sx={{
                border: "1px solid",
                borderColor: "neutral.outlinedBorder",
                borderRadius: "md",
                padding: 2,
                backgroundColor: "neutral.softBg",
                maxWidth: 400,
              }}
            >
              <Typography level="title-md" gutterBottom>
                File Details
              </Typography>

              <Stack spacing={1}>
                <Typography level="body-sm">
                  <strong>Name:</strong> {file.name}
                </Typography>
                <Typography level="body-sm">
                  <strong>Type:</strong> {file.type}
                </Typography>
                <Typography level="body-sm">
                  <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Stack>

              <Box mt={2}>
                <Button
                  onClick={() => handleFileSend(file)}
                  color="primary"
                  disabled={sending}
                  fullWidth
                >
                  Send
                </Button>
              </Box>
            </Box>
          )}
        </Sheet>
      </Modal>
    </Box>
  );
};

export default MessageInput;
