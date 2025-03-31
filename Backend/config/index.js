require("dotenv").config();

const accessTokenCookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain: "localhost",
  path: "/",
  sameSite: "lax",
  secure: false,
};

const jwtOptions = {
  expiresIn: 1000 * 24 * 60 * 60,
};

const configOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

module.exports = {
  accessTokenCookieOptions,
  jwtOptions,
  configOptions,
  corsOptions
};
