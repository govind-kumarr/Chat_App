export const ROUTES = {
  REGISTER: {
    URL: "/api/auth/user-register",
    METHOD: "POST",
  },
  LOGIN: {
    URL: "/api/auth/user-login",
    METHOD: "POST",
  },
  GOOGLE_LOGIN: {
    URL: "/api/auth/google-auth",
    METHOD: "GET",
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
  DELETE_FILE: {
    URL: "/api/file/delete",
    METHOD: "POST",
  },
  GET_CHATS: {
    URL: "/api/chat",
    METHOD: "GET",
  },
  DELETE_CHAT: {
    URL: "/api/chat",
    METHOD: "DELETE",
  },
  CHAT_USERS: {
    URL: "/api/chat/users",
    METHOD: "GET",
  },
  CREATE_GROUP: {
    URL: "/api/chat/group",
    METHOD: "POST",
  },
  GET_CHAT_MESSAGES: {
    URL: "/api/chat/messages",
    METHOD: "POST",
  },
  GROUP_MEMBERS: {
    URL: "/api/chat/group/members",
    METHOD: "POST",
  },
};
