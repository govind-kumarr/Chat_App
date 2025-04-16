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

const getUploadUrl = (data) => {
  return apiClient({
    url: ROUTES.UPLOAD_FILE.URL,
    method: ROUTES.UPLOAD_FILE.METHOD,
    data,
  });
};

const changeUploadStatus = (data) => {
  return apiClient({
    url: ROUTES.UPDATE_UPLOAD_STATUS.URL,
    method: ROUTES.UPDATE_UPLOAD_STATUS.METHOD,
    data,
  });
};

const deleteFile = (data) => {
  return apiClient({
    url: ROUTES.DELETE_FILE.URL,
    method: ROUTES.DELETE_FILE.METHOD,
    data,
  });
};

const getChatUsers = () => {
  return apiClient({
    url: ROUTES.CHAT_USERS.URL,
    method: ROUTES.CHAT_USERS.METHOD,
  });
};

const getChats = () => {
  return apiClient({
    url: ROUTES.GET_CHATS.URL,
    method: ROUTES.GET_CHATS.METHOD,
  });
};

const getGroupMembers = (data) => {
  return apiClient({
    url: ROUTES.GROUP_MEMBERS.URL,
    method: ROUTES.GROUP_MEMBERS.METHOD,
    data,
  });
};

const createGroup = (data) => {
  return apiClient({
    url: ROUTES.CREATE_GROUP.URL,
    method: ROUTES.CREATE_GROUP.METHOD,
    data,
  });
};

const getChatMessages = (data) => {
  return apiClient({
    url: ROUTES.GET_CHAT_MESSAGES.URL,
    method: ROUTES.GET_CHAT_MESSAGES.METHOD,
    data,
  });
};

const uploadFile = (url, data, mimeType) => {
  return apiClient({
    baseURL: url,
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
    },
    data,
    withCredentials: false,
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
  changeUploadStatus,
  uploadFile,
  getUploadUrl,
  getChatUsers,
  createGroup,
  getGroupMembers,
  deleteFile,
  getChatMessages,
  getChats,
};
