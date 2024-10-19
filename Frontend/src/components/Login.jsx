import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, validateSession } from "../store/auth/auth";
import { ToastContainer, toast } from "react-toastify";
import { getGoogleOAuthURL } from "../utils/utils";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = state;

    let errors = [];
    if (!email) errors.push("Please enter a email address");
    if (!password) errors.push("Please enter a valid password");

    if (errors.length > 0) {
      for (let error of errors) toast(error);
      return;
    }

    const form = new FormData();
    form.append("email", state.email);
    form.append("password", state.password);

    dispatch(loginUser(form));

    setState(initialState);
  };

  const inputChangeHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    // dispatch(validateSession());
  }, []);

  return (
    <div className="register">
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h3>Login</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email"
                id="email"
                name="email"
                onChange={inputChangeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="password"
                id="password"
                name="password"
                onChange={inputChangeHandler}
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Login" className="btn" />
            </div>
            <div className="form-group">
              <div>
                Don't have an account{" "}
                <span className="capitalize text-blue-800">
                  <Link to={"/messanger/register"}>Register here</Link>
                </span>
              </div>
            </div>
            <div className="form-group">
              <div>
                <a href={getGoogleOAuthURL()}>Login with google</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
