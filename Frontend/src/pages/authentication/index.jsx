import { Box } from "@mui/joy";
import Login from "./login";
import Register from "./register";

const AuthComponent = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Login />
      <Register />
    </Box>
  );
};

export default AuthComponent;
