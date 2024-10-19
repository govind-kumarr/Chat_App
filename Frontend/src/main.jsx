import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./main.scss";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import { QueryClient, QueryClientProvider } from "react-query";

console.log(import.meta.env["VITE_TEST"]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
