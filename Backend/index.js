const cors = require("cors");
const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
const session = require("express-session");
const { Server } = require("socket.io");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
const SECRET = process.env.SECRET;

app.use(
  cors({
    origin: "*",
  })
);

const store = MongoStore.create({
  client: mongoose.connect(MONGO_URL),
  mongoUrl: MONGO_URL,
  dbName: "messangerApp",
});

app.use(
  session({
    key: "user_sid",
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 12,
    },
  })
);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const authRouter = require("./routes/auth.routes");
const friendsRouter = require("./routes/friends.routes");
const fileRouter = require("./routes/file.routes");
const messageRouter = require("./routes/message.routes");
const { connectToDb } = require("./db/db");

app.use(express.json());

const port = process.env.PORT || 3030;

const validateSession = async (req, res, next) => {
  console.log(
    store.all((err, sessions) => {
      if (err) console.log(err);
      else console.log(sessions);
    })
  );
  next();
};

app.use("/api/auth", authRouter);
app.use("/api/friends", validateSession, friendsRouter);
app.use("/api/file", validateSession, fileRouter);
app.use("/api/chat", validateSession, messageRouter);

app.get("/", (req, res) => {
  res.send(`App is running on port ${port}`);
});

let users = [];

function addUser(userId, socketId) {
  let doesExist = users.find((user) => user.userId === userId);
  if (!doesExist) users.push({ userId, socketId });
}

function removeUser(userId) {
  users = users.filter((user) => user.userId !== userId);
}

function removeSocket(socketId) {
  users = users.filter((user) => user.socketId !== socketId);
}

io.on("connection", (socket) => {
  console.log(`new connection: ${socket.id}`);

  socket.on("addUser", (data) => {
    if (data && "userId" in data) addUser(data.userId, socket.id);
    // console.log(users);
    io.emit("activeUsers", users);
  });

  socket.on("sendMessage", (data) => {
    // console.log(data);
    socket.to(data?.socketId).emit("getMessage", data);
  });

  socket.on("messageDelivered", (data) => {
    // console.log("Message Delivered: ");
    // console.log(data);
    socket.to(data?.senderSocketId).emit("messageSent", data);
  });

  socket.on("messageSeen", (data) => {
    socket.to(data?.senderSocketId).emit("messageGotSeen", data);
  });

  socket.on("typingIndication", (data) => {
    socket.to(data?.socketId).emit("typing", data);
  });

  socket.on("stoppedTyping", (data) => {
    socket.to(data?.socketId).emit("not_typing", data);
  });

  socket.on("logout", (data) => {
    if (data && "userId" in data) removeUser(data.userId);
    // console.log(users);
  });

  // ON Client Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    removeSocket(socket.id);
    io.emit(
      "activeUsers",
      users.map((user) => user.userId)
    );
  });
});

const startServer = () =>
  server.listen(port, () => {
    console.log(`Server listening on Port ${port}`);
  });

connectToDb(startServer);

module.exports = {
  store,
};
