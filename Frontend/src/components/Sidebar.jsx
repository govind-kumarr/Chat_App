import { useRef, useState } from "react";

import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";

import ColorSchemeToggle from "./ColorSchemeToggle";
import { closeSidebar } from "../utils";
import {
  changeUploadStatus,
  getUploadUrl,
  logoutUser,
  uploadFile,
} from "../api/actions";
import { useNavigate } from "react-router-dom";
import SidebarList from "./sidebar-list";
import { useSelector } from "react-redux";
import useAppMutation from "../hooks/useAppMutation";
import {
  Button,
  CircularProgress,
  Modal,
  ModalClose,
  Stack,
  styled,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import VisuallyHiddenInput from "./VisuallyHiddenInput";
import AvatarWithStatus from "./AvatarWithStatus";

export default function Sidebar() {
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const {
    mutateAsync: getUploadUrlMutate,
    data: getUploadUrlResponse,
    isPending: getUploadUrlPending,
  } = useAppMutation({
    mutationFn: getUploadUrl,
    mutationKey: "getUploadUrl",
  });

  const {
    mutateAsync: changeUploadStatusMutate,
    isPending: uploadStatusPending,
  } = useAppMutation({
    mutationFn: changeUploadStatus,
    mutationKey: "changeUploadStatus",
  });

  const { mutateAsync: uploadFileMutate, isPending: uploadFilePending } =
    useAppMutation({
      mutationFn: (data) => uploadFile(data?.url, data?.file, data?.file?.type),
      mutationKey: "uploadFile",
    });

  const isUploading =
    uploadFilePending || uploadStatusPending || getUploadUrlPending;

  const {
    user: { user = {} },
    chat: { socketStatus },
  } = useSelector((state) => state);
  const { avatar, username, email } = user || {};

  const handleFileSelect = (e) => {
    const [file] = e.target.files;
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImage(null);
    setOpen(false);
  };

  const handleFileClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileUpload = async (file) => {
    await getUploadUrlMutate(
      {
        fileName: file?.name,
        size: file?.size,
        type: "avatar",
        mimeType: file?.type,
      },
      {
        onSuccess: async (response) => {
          const { url, fileId } = response?.data;
          await uploadFileMutate(
            { url, file },
            {
              onSuccess: async (response) => {
                await changeUploadStatusMutate(
                  { fileId },
                  {
                    onSuccess: () => {
                      queryClient.refetchQueries({
                        queryKey: ["geteUserInfo"],
                        exact: false,
                      });
                      handleClose();
                    },
                  }
                );
              },
            }
          );
        },
      }
    );
  };

  const { mutate: logoutMutate, isPending: isLoggingOut } = useAppMutation({
    mutationFn: logoutUser,
    mutationKey: "logoutUser",
    onSuccess: (response) => {
      navigate("/auth");
    },
  });

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">Acme Co.</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      {/* <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
      /> */}
      <SidebarList />
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box
          sx={{
            backgroundColor: "grey",
            borderRadius: "9999px",
            "&:hover": {
              opacity: 0.4,
              cursor: "pointer",
            },
          }}
          onClick={handleFileClick}
        >
          <AvatarWithStatus
            variant="outlined"
            size="sm"
            src={avatar}
            online={socketStatus === "connected"}
          />
          {/* <Avatar  /> */}
          <VisuallyHiddenInput
            type="file"
            ref={inputRef}
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{username || ""}</Typography>
          <Typography level="body-xs">{email || ""}</Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          disabled={isLoggingOut}
          onClick={() => logoutMutate()}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Stack gap={1}>
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              sx={{ fontWeight: "lg", mb: 1 }}
            >
              Upload Avatar
            </Typography>
            <img src={image} />
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              fullWidth
              gap={5}
            >
              <Button
                fullWidth
                onClick={handleClose}
                color="danger"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={() => handleFileUpload(file)}
                disabled={isUploading}
                color="success"
              >
                {isUploading ? <CircularProgress /> : "Update"}
              </Button>
            </Stack>
          </Stack>
        </Sheet>
      </Modal>
    </Sheet>
  );
}
