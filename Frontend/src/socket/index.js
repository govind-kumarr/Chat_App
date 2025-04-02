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

    SocketService.socket.on("new-message", (data) => {
      socketEventEmitter.emit("new-message", data);
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

  static sendMessage(recipientId, content) {
    SocketService.socket.emit(
      "add-message",
      { recipientId, content },
      (response) => {
        console.log({ response });
      }
    );
  }

  static getChatHistory(chatId) {
    SocketService.socket.emit("get-chat-history", chatId, (response) => {
      console.log({ response });
      socketEventEmitter.emit("chat-history", response?.chat || []);
    });
  }
}

export { SocketService };
