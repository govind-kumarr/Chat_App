const method = {
  get: "GET",
  post: "POST",
  delete: "DELETE",
  put: "PUT",
};

export const routes = {
  AUTHENTICATE: {
    url: "/auth/verify-session",
    method: method.get,
  },
};
