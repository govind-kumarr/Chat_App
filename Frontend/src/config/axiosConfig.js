import axios from "axios";

export const saveToken = (token) => {
  localStorage.setItem("access_token", token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const retrieveToken = () => localStorage.getItem("access_token");

axios.defaults.baseURL = "http://localhost:3030";
axios.defaults.withCredentials = true;

export { axios };
