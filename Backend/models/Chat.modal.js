const { default: mongoose } = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["group", "personal"],
      default: "personal",
      required: true,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
      required: false,
    },
    name: {
      type: String,
      default: "personal",
    },
    avatar: {
      key: {
        type: String,
        default: "",
        required: false,
      },
      url: {
        type: String,
        default: "",
        required: false,
      },
      urlExpiry: {
        type: Date,
        required: false,
      },
    },
    admin: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
      required: false,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
      required: false,
    },
  },
  { timestamps: true }
);

ChatSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  },
});

const ChatModel = mongoose.model("chats", ChatSchema);

module.exports = { ChatModel };
