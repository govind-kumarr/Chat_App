const cors = require("cors");
const express = require("express");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
const { Server } = require("socket.io");
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const authRouter = require("./routes/auth.routes");
const friendsRouter = require("./routes/friends.routes");
const fileRouter = require("./routes/file.routes");
const messageRouter = require("./routes/message.routes");
const { connectToDb } = require("./db/db");
const cookieParser = require("cookie-parser");
const {  validateSession } = require("./middlewares/auth.middleware");

app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3030;

app.use("/api/auth", authRouter);

app.use(validateSession);

app.use("/api/friends", friendsRouter);
app.use("/api/file", fileRouter);
app.use("/api/chat", messageRouter);

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

module.exports;
