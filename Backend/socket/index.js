const { SessionModel } = require("../models/Session.modal");
const { UserModel } = require("../models/User.modal");
const { parseCookies } = require("../utils");
const { ChatManager } = require("./chat-manager");
const { SocketManager } = require("./socket-manager");

require("dotenv").config();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User ${socket?.locals?.user?.username} connected`);
    const socketManager = new SocketManager(io, socket);
    socketManager.initialize();
  });
};

const attachMiddlewares = (io) => {
  io.use(async (socket, next) => {
    if (socket.handshake.headers.cookie) {
      const cookieObj = parseCookies(socket.handshake.headers.cookie);
      console.log("Cookies received in socket:", cookieObj);
      const sessionId = cookieObj.chat_app_sid;
      if (sessionId) {
        const session = await SessionModel.findById(sessionId);
        if (session) {
          let user = await UserModel.findById(session?.user);
          user = user ? user?.toJSON() : null;
          if (user) {
            socket.locals = { user };
            return next();
          }
          throw new Error("User not found");
        } else {
          console.log("session not present");
          next(new Error("Authentication error: No valid session found"));
        }
      }
      console.log("session not present");
      next(new Error("Authentication error: No valid session found"));
    }
    console.log("session not present");
    next(new Error("Authentication error: No valid cookie found"));
  });
};

module.exports = { initializeSocket, attachMiddlewares };
