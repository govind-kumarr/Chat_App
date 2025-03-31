import React from "react";
import Box from "@mui/joy/Box";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/actions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../store/snackbar";
import * as Yup from "yup";

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
  const navigate = useNavigate();
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

  const { mutate: registerMutate, isPending: registerPending } = useMutation({
    mutationFn: registerUser,
    mutationKey: "registerUser",
    onSuccess: (response) => {
      console.log({ response });
      // Show toast message
      reset();
      dispatch(
        showSnackbar({
          message: "User registered successfully!",
          variant: "success",
        })
      );
      navigate("/login");
    },
  });

  const submitRegister = (values) => {
    registerMutate(values);
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
        <Typography>Register</Typography>
        <form
          style={{
            width: "500px",
            margin: "auto",
          }}
          onSubmit={handleSubmit(submitRegister)}
        >
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <FormControl>
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input {...field} />
                <FormHelperText>
                  {errors?.confirmPassword?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Button type="submit" disabled={registerPending}>
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
