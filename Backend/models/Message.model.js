const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
  },
  senderSocketId: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const MessageModel = mongoose.model("messages", messageSchema);

module.exports = {
  MessageModel,
};
