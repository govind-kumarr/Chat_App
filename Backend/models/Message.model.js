const mongoose = require("mongoose");
const { FileModal } = require("./File.modal");

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
    type: mongoose.Schema.Types.Mixed,
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

messageSchema.path("content").validate(function (value) {
  return typeof value === "string" || value instanceof FileModal;
}, "Content must be a string or a FileModal instance");

const MessageModel = mongoose.model("messages", messageSchema);

module.exports = {
  MessageModel,
};
