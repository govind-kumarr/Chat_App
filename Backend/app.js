const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const { corsOptions } = require("./config");

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const { validateSession } = require("./middlewares/auth.middleware");

require("dotenv").config();

const app = express();

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", validateSession, userRouter);

app.get("/", (req, res) => {
  res.send(`App is running on port ${port}`);
});

module.exports = app;
