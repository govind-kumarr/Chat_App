const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "users",
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "chats", // Change to groups collection later
    },
    type: {
      type: String,
      enum: ["text", "media"],
      default: "text",
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "files",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      required: true,
      default: "sent",
    },
  },
  { timestamps: true }
);

MessageSchema.virtual("sender", {
  ref: "users",
  localField: "senderId",
  foreignField: "_id",
});

MessageSchema.virtual("recipient", {
  ref: "users",
  localField: "recipientId",
  foreignField: "_id",
});

MessageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  },
});

const MessageModel = mongoose.model("messages", MessageSchema);

module.exports = { MessageModel };
