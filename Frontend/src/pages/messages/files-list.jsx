import {
  IconButton,
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { useState } from "react";
import FileDetails from "../../components/file-details";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import useAppMutation from "../../hooks/useAppMutation";
import { deleteFile } from "../../api/actions";

const defaultConfirmModal = {
  open: false,
  message: "",
  fileId: "",
};
const FilesList = ({ files }) => {
  const [confirmModal, setConfirmModal] = useState(defaultConfirmModal);
  const { mutate, isPending: deletingFile } = useAppMutation({
    mutationKey: "deleteFile",
    mutationFn: deleteFile,
  });
  const handleFileDelete = (fileId) => {
    mutate(
      { fileId },
      {
        onSettled: () => {
          setConfirmModal(defaultConfirmModal);
        },
      }
    );
  };
  return (
    <Stack direction={"column"}>
      <List>
        {files?.length > 0 ? (
          files.map((file) => (
            <ListItem
              endAction={
                <IconButton
                  color="danger"
                  onClick={() => {
                    setConfirmModal({
                      open: true,
                      message: `Are you sure you want to delete ${file?.fileDetails?.originalFileName} ?`,
                      fileId: file?.file,
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemContent>
                <FileDetails key={file?.id} fileDetails={file?.fileDetails} />
              </ListItemContent>
            </ListItem>
          ))
        ) : (
          <Typography sx={{ textAlign: "center" }}> No files</Typography>
        )}
      </List>
      <Modal
        open={confirmModal?.open}
        onClose={() => setConfirmModal(defaultConfirmModal)}
        hideBackdrop={deletingFile}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>{confirmModal?.message}</DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={() => handleFileDelete(confirmModal?.fileId)}
              disabled={deletingFile}
            >
              Delete
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setConfirmModal(defaultConfirmModal)}
              disabled={deletingFile}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </Stack>
  );
};

export default FilesList;
