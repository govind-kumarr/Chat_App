require("dotenv").config();

const password = process.env.USER_RANDOM_PASS;

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

module.exports = {
  getUserFromGoogleRes,
  prepareSessionData,
  parseCookies,
};
