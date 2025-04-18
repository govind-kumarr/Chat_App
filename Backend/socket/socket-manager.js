const { MessageModel } = require("../models/Message.modal");
const {
  getChatHistory,
  getSocket,
  addMessage,
  findAndPopulateMessage,
  prepareChats,
  createChat,
  getUserGroups,
} = require("../services/chat.services");
const { getAllUsers, changeStatus } = require("../services/user.services");
const { toObjectId } = require("../utils");

class SocketManager {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    this.handleDisconnecting = this.handleDisconnecting.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.sendNewMessage = this.sendNewMessage.bind(this);
  }

  async initialize() {
    try {
      const socket = this.socket;
      if (socket) {
        const user = socket?.locals?.user;
        await changeStatus(user.id, true, socket.id);
        this.sendChats(socket.id);
        this.attachListeners();
        this.createGroups();
      }
    } catch (error) {
      console.log(`Error initializing: ${error.message}`);
    }
  }

  async createGroups() {
    try {
      const socket = this.socket;
      const user = socket?.locals?.user;
      if (socket && user) {
        const groupIds = await getUserGroups(user?.id);
        groupIds?.forEach((id) => socket.join(id));
      }
    } catch (error) {
      console.log(`Error creating rooms: ${error?.message}`);
    }
  }

  attachListeners() {
    const socket = this.socket;
    const user = socket?.locals?.user;
    const userId = user?.id;

    this.socket.on("get-chats", async (cb) => {
      console.log("userid", { userId });
      const chats = await prepareChats(userId);
      return cb({ chats });
    });
    this.socket.on("get-chat-history", async (chatId, cb) => {
      const chat = await getChatHistory(chatId);
      return cb({ chat });
    });
    this.socket.on("add-message", async (data, cb) => {
      try {
        const res = await addMessage(userId, data);
        cb({ message: "Message added successfully", data: res });
        this.sendNewMessage(
          res?.id,
          data?.type === "group" ? data?.chatId : null
        );
      } catch (error) {
        console.log(`Error: ${error?.message}`);
      }
    });
    this.socket.on("message-seen", async (data, cb) => {
      try {
        const { messageIds } = data;
        if (Array.isArray(messageIds)) {
          await markMessagesSeen(messageIds);
        }
      } catch (error) {
        console.log(`Error marking messages seen: ${error?.message}`);
      }
    });
    this.socket.on("disconnecting", this.handleDisconnecting);
    this.socket.on("disconnect", this.handleDisconnect);
  }

  async handleDisconnecting() {
    try {
      // Currently send complete chats again on disconnect Improve this to send just a signal of disconnecting user
      const user = this.socket?.locals?.user;
      const userId = user.id;
      await changeStatus(userId, false, "");
      // this.sendChats();
    } catch (error) {
      console.log(`Error: ${error?.message}`);
    }
  }

  async handleDisconnect() {
    // Currently send complete chats again on disconnect Improve this to send just a signal of disconnecting user
    const user = this.socket?.locals?.user;
    const userId = user.id;
    await changeStatus(userId, false, "");
    // this.sendChats();
    console.log(`User ${user?.username} disconnected`);
  }

  async sendNewMessage(messageId, groupId) {
    const io = this.io;
    const populatedMessage = await findAndPopulateMessage(messageId);

    if (messageId && io) {
      populatedMessage["sender"] = populatedMessage?.senderId;
      populatedMessage["senderId"] = populatedMessage?.sender?._id;

      if (populatedMessage.type === "media") {
        populatedMessage["fileDetails"] = populatedMessage?.file;
        populatedMessage["file"] = populatedMessage?.file?._id;
      }
      if (!groupId) {
        populatedMessage["recipient"] = populatedMessage?.recipientId;
        populatedMessage["recipientId"] = populatedMessage?.recipient?._id;
        const sendersSocket = populatedMessage?.sender?.socketId;
        const recieversSocket = populatedMessage?.recipient?.socketId;
        io.to(sendersSocket).emit("new-message", populatedMessage);
        io.to(recieversSocket).emit(
          "new-message",
          populatedMessage,
          async (res) => {
            if (res) {
              const { status } = res;
              if (status == "recieved") {
                await changeMessageStatus(messageId, "delivered");
              }
            }
          }
        );
      } else {
        // Emit message to group
        io.to(groupId).emit("new-message", populatedMessage);
      }
    }
  }

  async sendChats(socketId) {
    const io = this.io;
    const user = this.socket?.locals?.user;
    const userId = user.id;
    const chats = await prepareChats(userId);
    if (socketId) io.to(socketId).emit("chats", { chats });
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
