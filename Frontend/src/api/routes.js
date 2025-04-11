export const ROUTES = {
  REGISTER: {
    URL: "/api/auth/user-register",
    METHOD: "POST",
  },
  LOGIN: {
    URL: "/api/auth/user-login",
    METHOD: "POST",
  },
  FORGOT_PASSWORD: {
    URL: "/api/auth/forgot-password",
    METHOD: "POST",
  },
  RESET_PASSWORD: {
    URL: "/api/auth/reset-password",
    METHOD: "POST",
  },
  LOGOUT: {
    URL: "/api/auth/logout",
    METHOD: "POST",
  },
  AUTHENTICATE_USER: {
    URL: "/api/auth/verify-session",
    METHOD: "GET",
  },
  USER_INFO: {
    URL: "/api/user/info",
    METHOD: "GET",
  },
  UPLOAD_FILE: {
    URL: "/api/file/upload",
    METHOD: "POST",
  },
  UPDATE_UPLOAD_STATUS: {
    URL: "/api/file/save",
    METHOD: "POST",
  },
  CHAT_USERS: {
    URL: "/api/chat/users",
    METHOD: "GET",
  },
  CREATE_GROUP: {
    URL: "/api/chat/group",
    METHOD: "POST",
  },
};
