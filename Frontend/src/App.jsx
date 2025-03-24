import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import RootLayout from "./layout";
import MyProfile from "./components/MyMessages";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "messages",
          id: "messages",
          element: <MyProfile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      id: "login",
    },
    {
      path: "/register",
      element: <Register />,
      id: "register",
    },
  ]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <RouterProvider router={router} />
    </CssVarsProvider>
  );
}

export default App;
