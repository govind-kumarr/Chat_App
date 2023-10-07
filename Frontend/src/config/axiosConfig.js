import axios from "axios";

export const saveToken = (token) => localStorage.setItem("access_token", token);

export const retrieveToken = () =>
  JSON.parse(localStorage.getItem("access_token"));

axios.defaults.baseURL = "http://localhost:3030";
axios.defaults.headers.common["Authorization"] = `Bearer ${
  retrieveToken() || ""
}`;

export { axios };
