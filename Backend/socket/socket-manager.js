const { getAllUsers } = require("../services/user.services");
const { ChatManager } = require("./chat-manager");

class SocketManager {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.handleDisconnecting = this.handleDisconnecting.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
  }

  initialize() {
    const socket = this.socket;
    if (socket) {
      const user = socket?.locals?.user;
      ChatManager.addUser(socket.id, user.id);
      this.sendChats();
      this.sendActiveUsers();
      this.attachListeners();
    }
  }

  attachListeners() {
    this.socket.on("get-chats", async (cb) => {
      const chats = await this.getChats();
      return cb({ chats });
    });
    this.socket.on("get-active-users", async (cb) => {
      const activeUsers = this.getActiveUsers();
      return cb({ activeUsers });
    });
    this.socket.on("disconnecting", this.handleDisconnecting);
    this.socket.on("disconnect", this.handleDisconnect);
  }

  handleDisconnecting() {
    const user = this.socket?.locals?.user;
    const userId = user.id;
    ChatManager.removeActive(userId);
    this.sendActiveUsers();
    this.sendChats();
  }

  handleDisconnect() {
    const user = this.socket?.locals?.user;
    console.log(`User ${user?.username} disconnected`);
  }

  getActiveUsers() {
    const activeUsers = ChatManager.getActiveUsers();
    return activeUsers;
  }

  sendActiveUsers() {
    const socket = this.socket;
    const io = this.io;
    if (socket && io) {
      const activeUsers = this.getActiveUsers();
      io.emit("active-users", { activeUsers });
    }
  }

  async getChats() {
    const users = await getAllUsers();
    const activeUsers = ChatManager.getActiveUsers();
    const newUsers = users.map((u) => {
      const user = u.toJSON();
      return {
        ...user,
        isActive: activeUsers.some((ac) => ac.userId === u.id),
        type: "individual",
      };
    });
    return newUsers;
  }

  async sendChats() {
    const io = this.io;
    if (io) {
      const chats = await this.getChats();
      io.emit("chats", { chats });
    }
  }
}

module.exports = {
  SocketManager,
};
