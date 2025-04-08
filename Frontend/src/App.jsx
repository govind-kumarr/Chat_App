import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Authentcation from "./pages/authentication";
import RootLayout from "./layout";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import SnackbarComp from "./components/SnackbarComp";
import AuthLayout from "./layout/auth.layout";
import AuthRedirect from "./layout/auth-redirect";
import UserProvider from "./layout/user-provider";
import Messages from "./pages/messages";
import ForgotPassword from "./pages/authentication/forgot-password";

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
      path: "/auth",
      element: (
        <AuthRedirect>
          <Authentcation />
        </AuthRedirect>
      ),
      id: "auth",
    },
    // {
    //   path: "/auth/forgot-password/:resetPasswordToken",
    //   element: <ForgotPassword />,
    //   id: "forgot-password-token",
    // },
    {
      path: "/auth/forgot-password",
      element: <ForgotPassword />,
      id: "forgot-password",
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
