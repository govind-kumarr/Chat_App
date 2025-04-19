const { ChatModel } = require("../models/Chat.modal");
const { FileModel } = require("../models/File.modal");
const {
  getChatHistory,
  prepareChats,
  doChatExist,
} = require("../services/chat.services");
const { getAllUsers } = require("../services/user.services");
const { toObjectId } = require("../utils");

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users sent", users });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { chatId } = req.body;
    const [members] = await ChatModel.aggregate([
      {
        $match: {
          _id: toObjectId(chatId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          participants: 0,
        },
      },
    ]);
    res.status(200).json({ message: "Group members sent", members });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const createGroupController = async (req, res) => {
  try {
    const { participants, name = "", avatarFileId = "" } = req.body;
    const userId = req.locals?.user?._id;
    const uniqueParticipants = [...new Set([...participants, userId])];
    const group = new ChatModel({
      type: "group",
      participants: uniqueParticipants.map((participant) =>
        toObjectId(participant)
      ),
      admin: [toObjectId(userId)],
    });
    if (avatarFileId) {
      const file = await FileModel.findById(avatarFileId);
      if (file) {
        group.avatar.key = file.storageKey;
        group.avatar.url = file.url;
        group.avatar.urlExpiry = file.urlExpiry;
      }
    }
    if (!name) {
      //TODO: Concatenate all participants name to make group name with ,
    } else {
      group.name = name;
    }
    await group.save();
    res
      .status(200)
      .json({ message: "Group created successfully", groupId: group?._id });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatId, offset = 0, limit = 10 } = req.body;
    const messages = await getChatHistory(chatId, offset, limit);
    return res.status(200).json({
      message: "Messages sent successfully",
      messages,
      limit,
      items: messages?.length,
    });
  } catch (error) {
    console.error(`Error getting chat messages: ${error?.message}`);
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const getAllChats = async (req, res) => {
  try {
    const userId = req.locals?.user?.id;
    const chats = await prepareChats(userId);
    return res.status(200).json({
      message: "Chats sent successfully",
      chats,
    });
  } catch (error) {
    console.error(`Error getting chat messages: ${error?.message}`);
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.locals?.user?.id;
    const chat = await doChatExist(chatId);
    if (!chat || (chat && chat?.type !== "group"))
      throw new Error("Group doesn't exist");
    if (!chat.admin?.[0]?.equals(toObjectId(userId)))
      throw new Error("You are not admin of this group");
    await chat.deleteOne();
    return res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error(`Error getting chat messages: ${error?.message}`);
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const getUnreadCount = async (req, res) => {};

module.exports = {
  getAllUsersController,
  createGroupController,
  getGroupMembers,
  getChatMessages,
  getUnreadCount,
  getAllChats,
  deleteChat,
};
