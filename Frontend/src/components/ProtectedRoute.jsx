import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { validateSession } from "../store/auth/auth";
import { useMutation } from "react-query";
import { authenticate } from "../api";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    mutate: authenticationMutate,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: authenticate,
    mutationKey: "authenticate",
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    authenticationMutate();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  console.log({ isSuccess, isError, isLoading });

  return isSuccess ? children : <Navigate to={"/messanger/login"} />;
};

export default ProtectedRoute;
