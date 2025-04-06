import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { forgotPassword, resetPassword } from "../../api/actions";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Typography,
} from "@mui/joy";
import { showSnackbar } from "../../store/snackbar";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const defaultLoginValues = {
  email: "",
  password: "",
  confirmPassword: "",
  resetPasswordToken: "",
};

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: defaultLoginValues,
    // resolver: yupResolver(loginSchema),
  });

  const [email, resetPasswordToken] = watch(["email", "resetPasswordToken"]);

  console.log({ resetPasswordToken });

  const { mutate: forgotPassMutate, isPending: forgotPassPending } =
    useMutation({
      mutationFn: forgotPassword,
      mutationKey: "forgotPassword",
      onSuccess: (response) => {
        console.log({ response });
        dispatch(
          showSnackbar({
            message: response?.data?.message || "Reset link sent successfully!",
            variant: "success",
          })
        );
        reset();
      },
    });

  const { mutate: resetPassMutate, isPending: resetPassPending } = useMutation({
    mutationFn: resetPassword,
    mutationKey: "resetPassword",
    onSuccess: (response) => {
      console.log({ response });
      dispatch(
        showSnackbar({
          message: response?.data?.message || "Password successfully!",
          variant: "success",
        })
      );
      navigate("/auth");
    },
  });

  const handlePasswordReset = (values) => {
    const { password, confirmPassword } = values;
    if (!resetPasswordToken && email) {
      forgotPassMutate({ email });
      return;
    }
    resetPassMutate({
      password,
      confirmPassword,
      resetPasswordToken,
    });
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setValue("resetPasswordToken", decodeURIComponent(token));
    }
  }, [searchParams.get("token")]);
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
              Reset Password
            </Typography>
          </Stack>

          <Stack sx={{ gap: 4, mt: 2 }}>
            <form onSubmit={handleSubmit(handlePasswordReset)}>
              {!resetPasswordToken && (
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
              )}

              {resetPasswordToken && (
                <>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel>New Password</FormLabel>
                        <Input {...field} type="password" />
                        <FormHelperText>
                          {errors?.password?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input {...field} type="password" />
                        <FormHelperText>
                          {errors?.password?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </>
              )}

              <Stack sx={{ gap: 4, mt: 2 }}>
                <Button
                  type="submit"
                  disabled={
                    resetPassPending ||
                    forgotPassPending ||
                    (!resetPasswordToken && !email)
                  }
                  fullWidth
                >
                  {resetPasswordToken ? "Reset" : "Send Mail"}
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

export default ForgotPassword;
