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
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "users", // Change to groups collection later
    },
    type: {
      type: String,
      enum: ["text", "media"],
      required: true,
      default: "text",
    },
    content: {
      type: String,
      required: true,
      default: "",
    },
    file: {
      type: String,
      required: false,
      default: "",
      // ref: "users", // Change to files collection later
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
