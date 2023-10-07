const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes");
const friendsRouter = require("./routes/friends.routes");
const fileRouter = require("./routes/file.routes");
const messageRouter = require("./routes/message.routes");
const cors = require("cors");
const { connectToDb } = require("./db/db");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3030;

app.use("/api/auth", authRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/file", fileRouter);
app.use("/api/chat", messageRouter);

app.get("/", (req, res) => {
  res.send(`App is running on port ${port}`);
});

const startServer = () =>
  app.listen(port, () => {
    console.log(`Server listening on Port ${port}`);
  });

connectToDb(startServer);
