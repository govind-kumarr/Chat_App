const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286",
      required: false,
    },
    socketId: {
      type: String,
      default: "",
      required: false,
    },
    isActive: {
      type: Boolean,
      default: false,
      required: false,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret["password"];
    delete ret._id;
    return ret;
  },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = { UserModel };
