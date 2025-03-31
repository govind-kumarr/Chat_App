import React from "react";
import Snackbar from "@mui/joy/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../store/snackbar";

const SnackbarComp = () => {
  const { open, message, variant } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  return (
    <Snackbar
      autoHideDuration={4000}
      open={open}
      variant={"plain"}
      color={variant}
      onClose={() => dispatch(hideSnackbar())}
    >
      {message}
    </Snackbar>
  );
};

export default SnackbarComp;
