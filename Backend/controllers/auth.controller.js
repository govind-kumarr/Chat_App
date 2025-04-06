const {
  createUser,
  verifyUser,
  doUserExist,
  checkPasswordReset,
  verifyToken,
} = require("../services/user.services");
const {
  createSession,
  attachSession,
} = require("../services/session.services");
const {
  getUserFromGoogleRes,
  prepareSessionData,
  constructResetPasswordLink,
} = require("../utils");
const {
  getGoogleUser,
  getGoogleOAuthTokens,
} = require("../services/google-auth.services");
const { configOptions } = require("../config");
const { signJwt } = require("../utils/jwt.utils");
const { sendPasswordResetEmail } = require("../services/email.services");
const bcrypt = require("bcrypt");
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userExist = await doUserExist(email);
    if (!userExist) {
      throw new Error("User doesn't exist");
    }
    // const passwordReset = await checkPasswordReset(userExist?._id);
    if (userExist) {
      const token = signJwt({ email }, { expiresIn: 60 * 60 * 1000 });
      userExist.resetPasswordToken = token;
      userExist.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
      const resetPasswordLink = constructResetPasswordLink(token);
      const sendEmailRes = await sendPasswordResetEmail(
        userExist,
        resetPasswordLink
      );
      console.log(sendEmailRes.statusCode ? "Email Sent" : "Email not sent");
      if (sendEmailRes.statusCode === 202) {
        await userExist.save();
        res.status(200).json({ message: "Reset password mail sent" });
        return;
      }
      throw new Error();
    }
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, resetPasswordToken } = req.body;
    const { valid, tokenUser } = await verifyToken(resetPasswordToken);
    if (valid && tokenUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      tokenUser.password = hashedPassword;
      tokenUser.resetPasswordToken = null;
      tokenUser.resetTokenExpiry = null;
      await tokenUser.save();
      res.status(200).json({ message: "Password changed successfully" });
      return;
    }
    throw new Error("Invalid token");
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  googleAuthHandler,
  verifySession,
  forgotPassword,
  resetPassword,
};
