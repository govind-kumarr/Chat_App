import { apiClient } from "./axiosInstance";
import { ROUTES } from "./routes";

const registerUser = (data) => {
  return apiClient({
    url: ROUTES.REGISTER.URL,
    method: ROUTES.REGISTER.METHOD,
    data,
  });
};

const loginUser = (data) => {
  return apiClient({
    url: ROUTES.LOGIN.URL,
    method: ROUTES.LOGIN.METHOD,
    data,
  });
};

const forgotPassword = (data) => {
  return apiClient({
    url: ROUTES.FORGOT_PASSWORD.URL,
    method: ROUTES.FORGOT_PASSWORD.METHOD,
    data,
  });
};

const resetPassword = (data) => {
  return apiClient({
    url: ROUTES.RESET_PASSWORD.URL,
    method: ROUTES.RESET_PASSWORD.METHOD,
    data,
  });
};

const logoutUser = () => {
  return apiClient({
    url: ROUTES.LOGOUT.URL,
    method: ROUTES.LOGOUT.METHOD,
  });
};

const authenticateUser = () => {
  return apiClient({
    url: ROUTES.AUTHENTICATE_USER.URL,
    method: ROUTES.AUTHENTICATE_USER.METHOD,
  });
};

const geteUserInfo = () => {
  return apiClient({
    url: ROUTES.USER_INFO.URL,
    method: ROUTES.USER_INFO.METHOD,
  });
};

export {
  loginUser,
  registerUser,
  authenticateUser,
  logoutUser,
  geteUserInfo,
  forgotPassword,
  resetPassword,
};
