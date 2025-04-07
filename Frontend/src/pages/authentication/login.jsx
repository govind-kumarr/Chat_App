import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { forgotPassword, loginUser } from "../../api/actions";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store/snackbar";
import GoogleIcon from "../../assets/icons";
import useAppMutation from "../../hooks/useAppMutation";

const defaultLoginValues = {
  email: "",
  password: "",
};

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

const Login = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: defaultLoginValues,
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: loginMutate, isPending: loginPending } = useAppMutation({
    mutationFn: loginUser,
    mutationKey: "loginUser",
    onSuccess: (response) => {
      reset();
      navigate("/");
    },
  });

  const submitLogin = (values) => {
    loginMutate(values);
  };

  return (
    <Box
      sx={(theme) => ({
        width: { xs: "100%", md: "50vw" },
        transition: "width var(--Transition-duration)",
        transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
        position: "relative",
        zIndex: 1,
        display: "flex",
        justifyContent: "flex-end",
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(255 255 255 / 0.2)",
        [theme.getColorSchemeSelector("dark")]: {
          backgroundColor: "rgba(19 19 24 / 0.4)",
        },
      })}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          width: "100%",
          px: 2,
        }}
      >
        <Box
          component="main"
          sx={{
            my: "auto",
            py: 2,
            pb: 5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            maxWidth: "100%",
            mx: "auto",
            borderRadius: "sm",
            "& form": {
              display: "flex",
              flexDirection: "column",
              gap: 2,
            },
            [`& .MuiFormLabel-asterisk`]: {
              visibility: "hidden",
            },
          }}
        >
          <Stack sx={{ gap: 1, textAlign: "center" }}>
            <Typography component="h1" level="h3">
              Sign In
            </Typography>
          </Stack>
          <Stack sx={{ gap: 4, mb: 2 }}>
            <Button
              variant="soft"
              color="neutral"
              fullWidth
              startDecorator={<GoogleIcon />}
            >
              Continue with Google
            </Button>
          </Stack>
          <Divider
            sx={(theme) => ({
              [theme.getColorSchemeSelector("light")]: {
                color: { xs: "#FFF", md: "text.tertiary" },
              },
            })}
          >
            or
          </Divider>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={handleSubmit(submitLogin)}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors?.[`${field.name}`]?.message}>
                    <FormLabel>Email</FormLabel>
                    <Input {...field} type="email" />
                    <FormHelperText>{errors?.email?.message}</FormHelperText>
                  </FormControl>
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors?.[`${field.name}`]?.message}>
                    <FormLabel>Password</FormLabel>
                    <Input {...field} type="password" />
                    <FormHelperText>{errors?.password?.message}</FormHelperText>
                  </FormControl>
                )}
              />

              <Stack sx={{ gap: 4, mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Checkbox size="sm" label="Remember me" name="persistent" />
                  <Link level="title-sm" href="/auth/forgot-password">
                    Forgot your password?
                  </Link>
                </Box>
                <Button type="submit" disabled={loginPending} fullWidth>
                  Sign in
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
        <Box component="footer" sx={{ py: 3 }}></Box>
      </Box>
    </Box>
  );
};

export default Login;
