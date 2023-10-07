import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/auth/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  image: "",
};

const Register = () => {
  const [state, setState] = useState(initialState);
  const [imageLink, setImageLink] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { userName, email, password, image } = state;

    let errors = [];
    if (!userName) errors.push("Please enter a username");
    if (!email) errors.push("Please enter a email address");
    if (!password) errors.push("Please enter a valid password");
    if (!image) errors.push("Please select profile image");

    if (errors.length > 0) {
      for (let error of errors) toast(error);
      return;
    }

    const form = new FormData();
    form.append("username", userName);
    form.append("email", email);
    form.append("password", password);
    form.append("image", image);

    dispatch(registerUser(form));

    setState(initialState);
    setImageLink("");
  };

  const inputChangeHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const fileHandle = (e) => {
    if (e.target.files.length > 0) {
      console.log(e.target.files);
      setState({
        ...state,
        image: e.target.files[0],
      });
      const reader = new FileReader();
      reader.onload = () => {
        setImageLink(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="register">
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h3>Register</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="">User Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="username"
                name="userName"
                id="username"
                onChange={inputChangeHandler}
                value={state.userName}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email"
                name="email"
                id="email"
                onChange={inputChangeHandler}
                value={state.email}
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
                value={state.password}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                id="confirm-password"
                name="confirmPassword"
                onChange={inputChangeHandler}
                value={state.confirmPassword}
              />
            </div>
            <div className="form-group">
              <div className="file-image">
                <div className="image">
                  {imageLink ? <img src={imageLink} alt="profileImage" /> : ""}
                </div>
                <label htmlFor="profileImage">select image</label>
                <input
                  type="file"
                  name="image"
                  id="profileImage"
                  onChange={fileHandle}
                  accept="image/*"
                />
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="btn">
                Register
              </button>
            </div>
            <div className="form-group">
              <div>
                Already have an account{" "}
                <span>
                  <Link to={"/messanger/login"}>Login</Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
