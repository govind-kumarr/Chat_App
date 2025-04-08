import axios from "axios";
import { envVars } from "../getEnv";

const apiClient = axios.create({
  baseURL: envVars.SERVER_URL,
  withCredentials: true,
});

export { apiClient };
