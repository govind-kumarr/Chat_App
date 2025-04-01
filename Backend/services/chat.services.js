const { MessageModel } = require("../models/Message.modal");
const { UserModel } = require("../models/User.modal");
const { toObjectId } = require("../utils");

const getChatHistory = async (senderId, recipientId) => {
  const messages = await MessageModel.find({
    $or: [
      {
        senderId: toObjectId(senderId),
        recipientId: toObjectId(recipientId),
      },
      {
        senderId: toObjectId(recipientId),
        recipientId: toObjectId(senderId),
      },
    ],
  }).sort({ createdAt: -1 });
  return messages;
};

const addMessage = async (senderId, recipientId, content) => {
  if (senderId && recipientId && content) {
    return MessageModel.insertMany([
      {
        senderId: toObjectId(senderId),
        recipientId: toObjectId(recipientId),
        content,
      },
    ]);
  }
};

const getSocket = async (id = "") => {
  const user = await UserModel.findById({ id: toObjectId(id) });
  return user?.socketId;
};

module.exports = { getChatHistory, getSocket, addMessage };
