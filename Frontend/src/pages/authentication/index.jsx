import { Box } from "@mui/joy";
import Login from "./login";
import Register from "./register";
import CreateGroupModal from "../messages/create-group-modal";

const AuthComponent = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Login />
      <Register />
      {/* <CreateGroupModal /> */}
    </Box>
  );
};

export default AuthComponent;
