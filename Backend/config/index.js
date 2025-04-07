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

const loadEnv = () => {
  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    userDir: process.env.S3_USER_DIR,
    chatDir: process.env.S3_CHAT_DIR,
    mongodbUrl: process.env.MONGO_URL,
  };
};

module.exports = {
  accessTokenCookieOptions,
  jwtOptions,
  configOptions,
  corsOptions,
  loadEnv,
};
