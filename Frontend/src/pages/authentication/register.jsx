import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { registerUser } from "../../api/actions";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import useAppMutation from "../../hooks/useAppMutation";

const defaultRegisterValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .required("Username is required"),
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: defaultRegisterValues,
    resolver: yupResolver(registerSchema),
  });

  const { mutate: registerMutate, isPending: registerPending } = useAppMutation(
    {
      mutationFn: registerUser,
      mutationKey: "registerUser",
      onSuccess: (response) => {
        reset();
      },
    }
  );

  const submitRegister = (values) => {
    registerMutate(values);
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
              Sign Up
            </Typography>
          </Stack>
          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={handleSubmit(submitRegister)}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors?.[`${field.name}`]?.message}>
                    <FormLabel>Username</FormLabel>
                    <Input {...field} />
                    <FormHelperText>{errors?.username?.message}</FormHelperText>
                  </FormControl>
                )}
              />
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
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors?.[`${field.name}`]?.message}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input {...field} type="password" />
                    <FormHelperText>
                      {errors?.confirmPassword?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Stack sx={{ gap: 4, mt: 2 }}>
                <Button type="submit" disabled={registerPending} fullWidth>
                  Sign Up
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

export default Register;
