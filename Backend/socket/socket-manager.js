const {
  getChatHistory,
  getSocket,
  addMessage,
} = require("../services/chat.services");
const { getAllUsers, changeStatus } = require("../services/user.services");
const { toObjectId } = require("../utils");

class SocketManager {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.handleDisconnecting = this.handleDisconnecting.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  async initialize() {
    try {
      const socket = this.socket;
      if (socket) {
        const user = socket?.locals?.user;
        await changeStatus(user.id, true, socket.id);
        this.sendChats();
        this.attachListeners();
      }
    } catch (error) {
      console.log(`Error initializing: ${error.message}`);
    }
  }

  attachListeners() {
    const socket = this.socket;
    const user = socket?.locals?.user;
    const userId = user?.id;
    this.socket.on("get-chats", async (cb) => {
      const chats = await getAllUsers();
      return cb({ chats });
    });
    this.socket.on("get-chat-history", async (chatId, cb) => {
      const chat = await getChatHistory(userId, chatId);
      return cb({ chat });
    });
    this.socket.on("add-message", async (data, cb) => {
      const res = await addMessage(userId, data?.recipientId, data?.content);
      cb({ message: "Message added successfully", data: "res" });
    });
    this.socket.on("disconnecting", this.handleDisconnecting);
    this.socket.on("disconnect", this.handleDisconnect);
  }

  async handleDisconnecting() {
    const user = this.socket?.locals?.user;
    const userId = user.id;
    await changeStatus(userId, false, "");
    this.sendChats();
  }

  handleDisconnect() {
    const user = this.socket?.locals?.user;
    console.log(`User ${user?.username} disconnected`);
  }

  async sendChats() {
    const io = this.io;
    const chats = await getAllUsers();
    io.emit("chats", { chats });
  }

  async sendChatHistory(senderId, recipientId) {
    const io = this.io;
    const sendersSocket = getSocket(senderId);
    const recieversSocket = getSocket(recipientId);
    const chats = await getChatHistory(senderId, recipientId);
    io.to(sendersSocket).emit("chat-history", { chats });
    io.to(recieversSocket).emit("chat-history", { chats });
  }
}

module.exports = {
  SocketManager,
};
