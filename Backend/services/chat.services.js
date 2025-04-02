const { MessageModel } = require("../models/Message.modal");
const { UserModel } = require("../models/User.modal");
const { toObjectId } = require("../utils");

const getChatHistory = async (senderId, recipientId) => {
  const messages = await MessageModel.aggregate([
    {
      $match: {
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
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "senderId",
        foreignField: "_id",
        as: "sender",
      },
    },
    {
      $unwind: "$sender",
    },
    {
      $project: {
        id: { $toString: "$_id" },
        senderId: { $toString: "$senderId" },
        recipientId: { $toString: "$recipientId" },
        sender: 1,
        type: 1,
        content: 1,
        status: 1,
        createdAt: 1,
        _id: 0,
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
  ]);
  return messages;
};

const findAndPopulateMessage = async (id) => {
  return MessageModel.findOne({ _id: toObjectId(id) })
    .populate({
      path: "senderId",
      options: {
        alias: "sender",
      },
    })
    .populate({
      path: "recipientId",
      options: {
        alias: "recipient",
      },
    })
    .lean();
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

module.exports = {
  getChatHistory,
  getSocket,
  addMessage,
  findAndPopulateMessage,
};
