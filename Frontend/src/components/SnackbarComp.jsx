import React from "react";
import Snackbar from "@mui/joy/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../store/snackbar";
import { Button, IconButton } from "@mui/joy";
import { Close } from "@mui/icons-material";

const SnackbarComp = () => {
  const { open, message, variant } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  return (
    <Snackbar
      autoHideDuration={4000}
      open={open}
      variant={"outlined"}
      color={variant}
      onClose={() => dispatch(hideSnackbar())}
      endDecorator={
        <IconButton
          onClick={() => dispatch(hideSnackbar())}
          size="sm"
          variant="plain"
          color={variant}
        >
          <Close />
        </IconButton>
      }
    >
      {message}
    </Snackbar>
  );
};

export default SnackbarComp;
