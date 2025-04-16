import { Box } from "@mui/joy";
import Login from "./login";
import Register from "./register";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store/snackbar";
import { authCodeMessageMap } from "../../constants";

const AuthComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const message = authCodeMessageMap[error] || "Something went wrong!";
      dispatch(
        showSnackbar({
          title: message,
          variant: "danger",
        })
      );
      setSearchParams({});
    }
  }, [searchParams]);
  return (
    <Box sx={{ display: "flex" }}>
      <Login />
      <Register />
    </Box>
  );
};

export default AuthComponent;
