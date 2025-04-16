import React from "react";
import Snackbar from "@mui/joy/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../store/snackbar";
import { IconButton, Typography, Stack } from "@mui/joy";
import { Close } from "@mui/icons-material";

const SnackbarComp = () => {
  const { open, variant, title, description } = useSelector(
    (state) => state.snackbar
  );
  const dispatch = useDispatch();

  return (
    <Snackbar
      autoHideDuration={4000}
      open={open}
      variant={"outlined"}
      color={variant}
      onClose={() => dispatch(hideSnackbar())}
      endDecorator={
        <Stack justifyContent={"start"}>
          <IconButton
            onClick={() => dispatch(hideSnackbar())}
            size="sm"
            variant="plain"
            color={variant}
          >
            <Close />
          </IconButton>
        </Stack>
      }
    >
      <div>
        <Typography>{title}</Typography>
        <Typography sx={{ mt: 1, mb: 2 }}>{description}</Typography>
      </div>
    </Snackbar>
  );
};

export default SnackbarComp;
