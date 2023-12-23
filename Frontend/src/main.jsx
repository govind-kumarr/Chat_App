import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./main.scss";
import { Provider } from "react-redux";
import { store } from "./store/index.js";

console.log(import.meta.env['VITE_TEST'])

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
