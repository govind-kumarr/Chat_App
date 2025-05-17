import { io } from "socket.io-client";
import { envVars } from "../getEnv";
import { socketEventEmitter } from "./emiitter";

class SocketService {
  static socket = null;

  static connect() {
    if (SocketService.socket) return;

    const socket = io(envVars.SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      withCredentials: true,
    });
    SocketService.socket = socket;
    SocketService.socket.on("connect", () => {
      SocketService.intialize();
      socketEventEmitter.emit("connect", null);
    });
  }

  static intialize() {
    SocketService.attachListners();
  }

  static attachListners() {
    if (!SocketService.socket) return;
    SocketService.socket.on("active-users", (data) => {
      socketEventEmitter.emit("active-users", data);
    });

    SocketService.socket.on("chats", (data) => {
      socketEventEmitter.emit("chats", data);
    });

    SocketService.socket.on("message-notification", (data) => {
      socketEventEmitter.emit("message-notification", data);
    });

    SocketService.socket.on("new-message", (data, cb) => {
      socketEventEmitter.emit("new-message", data);
      cb({ status: "recieved" });
    });

    SocketService.socket.on("reconnect", (data) => {
      socketEventEmitter.emit("reconnect", data);
    });

    SocketService.socket.on("reconnect_attempt", (data) => {
      socketEventEmitter.emit("reconnect_attempt", data);
    });

    SocketService.socket.on("disconnect", (data) => {
      socketEventEmitter.emit("disconnect", data);
    });
  }

  static getChats() {
    SocketService.socket.emit("get-chats", (data) => {
      socketEventEmitter.emit("chats", data);
    });
  }

  static getActiveUsers() {
    SocketService.socket.emit("get-active-users", (data) => {
      socketEventEmitter.emit("active-users", data);
    });
  }

  static sendMessage(data, cb) {
    SocketService.socket.emit("add-message", data, cb);
  }

  static getChatHistory(chatId) {
    SocketService.socket.emit("get-chat-history", chatId, (response) => {
      console.log({ response });
      socketEventEmitter.emit("chat-history", response?.chat || []);
    });
  }
}

export { SocketService };
