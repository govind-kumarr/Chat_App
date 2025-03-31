import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import RootLayout from "./layout";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import SnackbarComp from "./components/SnackbarComp";
import AuthLayout from "./layout/auth.layout";
import AuthRedirect from "./layout/auth-redirect";
import UserProvider from "./layout/user-provider";
import Messages from "./pages/messages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthLayout>
          <UserProvider>
            <RootLayout />
          </UserProvider>
        </AuthLayout>
      ),
      children: [
        {
          index: true,
          id: "home",
          element: <Messages />,
        },
        {
          path: "messages",
          id: "messages",
          element: <Messages />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <AuthRedirect>
          <Login />
        </AuthRedirect>
      ),
      id: "login",
    },
    {
      path: "/register",
      element: (
        <AuthRedirect>
          <Register />
        </AuthRedirect>
      ),
      id: "register",
    },
  ]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <SnackbarComp />
      <RouterProvider router={router} />
    </CssVarsProvider>
  );
}

export default App;
