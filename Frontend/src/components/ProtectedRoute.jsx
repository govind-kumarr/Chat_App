import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { validateSession } from "../store/auth/auth";

const ProtectedRoute = ({ children }) => {
  const { authenticate } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(validateSession());
  }, []);
  return authenticate ? children : <Navigate to={"/messanger/login"} />;
};

export default ProtectedRoute;
