const { createUser, verifyUser } = require("../services/user.services");
const {
  createSession,
  attachSession,
} = require("../services/session.services");
const { getUserFromGoogleRes, prepareSessionData } = require("../utils");
const {
  getGoogleUser,
  getGoogleOAuthTokens,
} = require("../services/google-auth.services");
const { jwtOptions, configOptions } = require("../config");
require("dotenv").config();

const app_url = process.env.APP_URL;

const userRegister = async (req, res) => {
  try {
    // Create user (this will check for unique username & email)
    const user = await createUser(req.body);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const userLogin = async (req, res) => {
  try {
    const userDetails = await verifyUser(req.body);
    const session = await createSession(userDetails?._id);
    attachSession(res, session?._id);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const userLogout = async (req, res) => {
  res.clearCookie("chat_app_sid", configOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

const googleAuthHandler = async (req, res) => {
  const code = req.query.code;
  // get id_token and access_token
  const { id_token, access_token } = await getGoogleOAuthTokens({ code });
  // Retrieve user from id_token and access_token
  const googleUser = await getGoogleUser({ id_token, access_token });

  if (!googleUser.verified_email)
    res.status(401).send("Email is not verified!");

  const userData = getUserFromGoogleRes(googleUser);
  const user = await createUser(userData);
  const session = await createSession(user._id);
  attachSession(res, session?._id);

  res.redirect(app_url);
};

const verifySession = async (req, res) => {
  return res.json({
    authenticated: true,
  });
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  googleAuthHandler,
  verifySession,
};
