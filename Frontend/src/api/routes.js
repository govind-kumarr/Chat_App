export const ROUTES = {
  REGISTER: {
    URL: "/api/auth/user-register",
    METHOD: "POST",
  },
  LOGIN: {
    URL: "/api/auth/user-login",
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
};
