import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { authenticate } = useSelector((store) => store.auth);
  return authenticate ? children : <Navigate to={"/messanger/login"} />;
};

export default ProtectedRoute;
