const { Server } = require("socket.io");

const io = new Server(8080, {
  cors: {
    origin: "*",
  },
});

let users = [];
let messages = [];

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

function addMessage(userId, message) {
  messages.push({
    userId,
    message,
  });
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
