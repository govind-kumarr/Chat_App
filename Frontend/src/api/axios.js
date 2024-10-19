import axios from "axios";

export const apiClient = axios.create({
  withCredentialsL: true,
  baseURL: "http://localhost:3030/api",
});
