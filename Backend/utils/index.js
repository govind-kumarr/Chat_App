const { default: mongoose } = require("mongoose");

require("dotenv").config();

const password = process.env.USER_RANDOM_PASS;
const APP_URL = process.env.APP_URL;

const getUserFromGoogleRes = (googleUser = {}) => {
  const newUser = {
    username: googleUser.name,
    email: googleUser.email,
    password,
    avatar: googleUser.picture,
  };

  return newUser;
};

const prepareSessionData = (user) => {
  return { username: user?.username, userId: user?._id };
};

const parseCookies = (cookieStr = "") => {
  let cookieObj = {};

  cookieStr.split("; ").forEach((cookie) => {
    const [key, ...value] = cookie.split("=");
    let parsedValue = decodeURIComponent(value.join("="));

    if (parsedValue.startsWith("j:")) {
      parsedValue = parsedValue.slice(2);
    }

    try {
      parsedValue = JSON.parse(parsedValue);
    } catch (error) {}

    cookieObj[key] = parsedValue;
  });

  return cookieObj;
};

const isAfter = (date) => {
  const now = new Date();
  const dateObj = new Date(date);
  return dateObj > now;
};

const toObjectId = (id = "") =>
  mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id;

const parseObjectId = (id = "") =>
  mongoose.isValidObjectId(id) ? id.toString() : id;

const constructResetPasswordLink = (token) =>
  `${APP_URL}auth/forgot-password?token=${encodeURIComponent(token)}`.trim();

const getStorageKey = ({ type, fileId, userId = "", chatId = "" }) => {
  return (
    type === "user-data"
      ? `${type}/${userId}/avatar/${fileId}`
      : `${type}/${chatId}/media/${fileId}`
  ).trim();
};

module.exports = {
  getUserFromGoogleRes,
  prepareSessionData,
  parseCookies,
  toObjectId,
  isAfter,
  constructResetPasswordLink,
  getStorageKey,
  parseObjectId,
};
