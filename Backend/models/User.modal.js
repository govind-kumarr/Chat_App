const { default: mongoose } = require("mongoose");
const { generateAvatarUrl } = require("../services/user.services");

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
      key: {
        type: String,
      },
      url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286",
        required: false,
      },
      urlExpiry: {
        type: Date,
      },
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
    resetPasswordToken: {
      type: String,
      default: null,
      required: false,
    },
    resetTokenExpiry: {
      type: Date,
      default: Date.now,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.checkAvatar = async function () {
  await generateAvatarUrl(this);
};

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.avatar = ret?.avatar?.url || null;

    delete ret["password"];
    delete ret._id;
    delete ret.resetPasswordToken;
    delete ret.resetTokenExpiry;

    return ret;
  },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = { UserModel };
