const aws = require("../aws");
const { ChatModel } = require("../models/Chat.modal");
const { MessageModel } = require("../models/Message.modal");
const { UserModel } = require("../models/User.modal");
const {
  toObjectId,
  getStorageKey,
  parseObjectId,
  oneWeekAhead,
} = require("../utils");
const { createFile } = require("./file.services");

const getChatHistory = async (chatId, offset, limit) => {
  try {
    const chat = await MessageModel.aggregate([
      {
        $match: {
          chatId: toObjectId(chatId),
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
          recipientId: {
            $ifNull: ["$recipientId", null],
          },
          avatar: "$sender.avatar.url",
          isActive: "$sender.isActive",
          senderName: "$sender.username",
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
          createdAt: -1,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]);
    return chat?.reverse();
  } catch (error) {
    console.error(`Error getting chat history: ${error?.message}`);
  }
};

const createChat = async (type, participants) => {
  try {
    if (type === "personal" && participants?.length === 2) {
      const chat = new ChatModel({
        type,
        participants,
      });
      await chat.save();
      return chat;
    }
    if (type === "group" && participants?.length >= 2) {
      const chat = new ChatModel({
        type,
        participants,
      });
      await chat.save();
      return chat;
    }
    console.log("Participants should be more than 2");
  } catch (error) {
    console.log(`Error creating chat ${error?.message}`);
  }
};

const findChat = async (filter) => {
  if (filter?.type === "personal") {
    const chat = await ChatModel.findOne({
      type: filter.type,
      participants: { $size: 2, $all: filter.participants },
    });
    return chat;
  }
  const chat = await ChatModel.find({
    type: filter.type,
    participants: { $in: filter.participants },
  });
  return chat;
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
    recipientId = "",
    content = "",
    messageType = "",
    type = "",
    fileInfo = {},
    chatId = "",
  } = data || {};

  const message = new MessageModel({
    senderId: toObjectId(senderId),
    status: "sent",
  });

  if (chatId) {
    message.chatId = chatId;
    const chat = await ChatModel.findById(chatId);
    chat.lastMessage = message?._id;
    await chat.save();
  } else {
    if (type === "user" && recipientId) {
      message.recipientId = toObjectId(recipientId);
      let chat = await findChat({
        type: "personal",
        participants: [toObjectId(senderId), toObjectId(recipientId)],
      });
      if (!chat) {
        chat = await createChat("personal", [
          toObjectId(senderId),
          toObjectId(recipientId),
        ]);
      }
      chat.lastMessage = message?._id;
      message.chatId = chat?._id;
    }
  }

  if (messageType === "media") {
    const file = await createFile({ ...fileInfo, userId: senderId });

    message.type = "media";
    message.file = toObjectId(file?._id);
    message.content = fileInfo?.fileName || "---";

    const key = getStorageKey({
      type: "chat-data",
      fileId: parseObjectId(file?._id),
      chatId: `${parseObjectId(senderId)}-${parseObjectId(recipientId)}`,
    });
    const url = await aws.generateUploadUrl(key, {
      mimeType: fileInfo?.mimeType,
    });
    file.url = url;
    file.storageKey = key;
    file.urlExpiry = oneWeekAhead();
    await file.save();
    await message.save();
    return { url, fileId: file?._id, id: message?._id };
  } else {
    message.content = content;
    await message.save();
    return { id: message?._id };
  }
};

const changeMessageStatus = async (messageId, status) => {
  try {
    const message = await MessageModel.findById(messageId);
    if (message) {
      message.status = status;
      message.save();
    }
  } catch (error) {
    console.error(`Error changing status of message: ${error?.message}`);
  }
};

const markMessagesSeen = async (messageIds = []) => {
  await MessageModel.updateMany(
    { _id: { $in: messageIds.map((id) => toObjectId(id)) } },
    { status: "seen" }
  );
};

const getSocket = async (id = "") => {
  const user = await UserModel.findById({ id: toObjectId(id) });
  return user?.socketId;
};

const prepareChats = async (userId) => {
  try {
    if (!userId) return;

    const userObjectId = toObjectId(userId);
    const chats = await ChatModel.aggregate([
      {
        $match: {
          type: "personal",
          participants: {
            $in: [userObjectId],
          },
        },
      },
      {
        $addFields: {
          recipientIds: {
            $filter: {
              input: "$participants",
              as: "participantId",
              cond: { $ne: ["$$participantId", userObjectId] },
            },
          },
        },
      },
      {
        $project: {
          participants: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipientIds",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $unwind: "$recipient",
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          type: 1,
          name: "$recipient.username",
          avatar: "$recipient.avatar.url",
          isActive: "$recipient.isActive",
          recipientId: "$recipient._id",
          email: "$recipient.email",
          lastMessageAt: {
            $ifNull: ["$lastMessage.createdAt", null],
          },
          lastMessageType: {
            $ifNull: ["$lastMessage.type", null],
          },
          lastMessageContent: {
            $ifNull: ["$lastMessage.content", null],
          },
        },
      },
      {
        $sort: {
          lastMessageAt: -1,
        },
      },
    ]);
    const chatUsersArr = chats?.map((c) => c?.recipientId).concat(userObjectId);
    const users = await UserModel.aggregate([
      { $match: { _id: { $nin: chatUsersArr } } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          type: "user",
          name: "$username",
          avatar: "$avatar.url",
          isActive: "$isActive",
          lastActiveAt: "$lastActiveAt",
          email: "$email",
        },
      },
    ]);
    const groups = await ChatModel.aggregate([
      {
        $match: {
          type: "group",
          participants: { $in: [userObjectId] },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          type: 1,
          name: 1,
          avatar: "$avatar.url",
          lastMessageAt: {
            $ifNull: ["$lastMessage.createdAt", null],
          },
          lastMessageType: {
            $ifNull: ["$lastMessage.type", null],
          },
          lastMessageContent: {
            $ifNull: ["$lastMessage.content", null],
          },
          participants: 1,
        },
      },
      {
        $sort: {
          lastMessageAt: -1,
        },
      },
    ]);

    // Find group participant

    const finalResult = chats.concat(groups).sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });
    return finalResult.concat(users);
  } catch (error) {
    console.error("Error in prepareChats:", error.message);
  }
};

const getUserGroups = async (userId) => {
  const [response] = await ChatModel.aggregate([
    {
      $match: {
        participants: { $in: [toObjectId(userId)] },
        type: "group",
      },
    },
    {
      $group: {
        _id: null,
        groupIds: {
          $push: { $toString: "$_id" },
        },
      },
    },
  ]);
  return response?.groupIds || [];
};

const isGroupAdmin = async (chatId, userId) => {
  try {
    const chat = await ChatModel.findById(chatId);
    if (chat) {
      return chat.admin[0].equals(toObjectId(userId)) ? chat : false;
    }
    return false;
  } catch (error) {
    console.log(`Error checking chat admin: ${error?.message}`);
  }
};

const doChatExist = async (chatId) => {
  try {
    const chat = await ChatModel.findById(chatId);
    return chat;
  } catch (error) {
    console.log(`Error checking chat exist: ${error?.message}`);
  }
};

module.exports = {
  getChatHistory,
  getSocket,
  addMessage,
  findAndPopulateMessage,
  createChat,
  findChat,
  prepareChats,
  changeMessageStatus,
  markMessagesSeen,
  getUserGroups,
  isGroupAdmin,
  doChatExist,
};
