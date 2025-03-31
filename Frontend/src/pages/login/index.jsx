import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { loginUser } from "../../api/actions";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store/snackbar";

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

  const { mutate: loginMutate, isPending: loginPending } = useMutation({
    mutationFn: loginUser,
    mutationKey: "loginUser",
    onSuccess: (response) => {
      console.log({ response });
      // Show toast message
      reset();
      dispatch(
        showSnackbar({
          message: response?.data?.message || "Logged in successfully!",
          variant: "success",
        })
      );
      navigate("/");
    },
  });

  const submitLogin = (values) => {
    loginMutate(values);
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Typography>Login</Typography>
        <form
          style={{
            width: "500px",
            margin: "auto",
          }}
          onSubmit={handleSubmit(submitLogin)}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormControl>
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
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input {...field} type="password" />
                <FormHelperText>{errors?.password?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Button type="submit" disabled={loginPending}>
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
