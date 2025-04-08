const aws = require("../aws");
const { MessageModel } = require("../models/Message.modal");
const { UserModel } = require("../models/User.modal");
const {
  toObjectId,
  getStorageKey,
  parseObjectId,
  oneWeekAhead,
} = require("../utils");
const { createFile } = require("./file.services");

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
        file: 1,
        _id: 0,
      },
    },
    {
      $lookup: {
        from: "files",
        let: { fileId: "$file" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$fileId"] }],
              },
            },
          },
        ],
        as: "fileDetails",
      },
    },
    {
      $unwind: {
        path: "$fileDetails",
        preserveNullAndEmptyArrays: true,
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
    .populate({
      path: "file",
      options: {
        alias: "recipient",
      },
    })
    .lean();
};

const addMessage = async (senderId, data) => {
  const {
    recipientId,
    content = "",
    messageType,
    type,
    fileInfo = {},
    groupId,
  } = data || {};

  if (messageType === "media") {
    const file = await createFile({ ...fileInfo, userId: senderId });
    const message = new MessageModel({
      senderId: toObjectId(senderId),
      type: "media",
      file: toObjectId(file?._id),
      content: fileInfo?.fileName || "---",
      status: "sent",
    });
    message[type === "group" ? "groupId" : "recipientId"] =
      type === "group" ? toObjectId(groupId) : toObjectId(recipientId);
    await message.save();
    const key = getStorageKey({
      type: "chat-data",
      fileId: parseObjectId(file?._id),
      chatId: `${parseObjectId(senderId)}-${parseObjectId(recipientId)}`,
    });
    const url = await aws.generateUploadUrl(key, {
      mimeType: fileInfo?.mimeType,
    }); // Modify the mimeType
    file.url = url;
    file.storageKey = key;
    file.urlExpiry = oneWeekAhead();
    await file.save();
    return { url, fileId: file?._id, id: message?._id };
  }

  if (senderId && recipientId && content) {
    const message = new MessageModel({
      senderId: toObjectId(senderId),
      content,
    });
    message[type === "group" ? "groupId" : "recipientId"] =
      type === "group" ? toObjectId(groupId) : toObjectId(recipientId);
    await message.save();
    return { id: message?._id };
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
