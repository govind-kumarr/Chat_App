const { default: mongoose } = require("mongoose");
const { oneWeekAhead, isIsoString } = require("../utils");
const aws = require("../aws");

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

const generateAvatarUrl = async (user) => {
  const { avatar } = user || {};
  if (!avatar) return null;
  const { url, key, urlExpiry } = avatar || {};
  if (key) {
    if (urlExpiry && isIsoString(urlExpiry)) {
      const now = new Date();
      const expiryDate = new Date(urlExpiry);
      if (now > expiryDate) {
        // Generate a new pre signed url
        const newUrl = await aws.getPreSignedUrl(key);
        if (newUrl) {
          user.avatar.url = newUrl;
          user.avatar.urlExpiry = oneWeekAhead();
        }
        return newUrl;
      }
    } else {
      const newUrl = await aws.getPreSignedUrl(key);
      user.avatar.url = newUrl;
      user.avatar.urlExpiry = oneWeekAhead();
      return newUrl;
    }
  }

  return null;
};

UserSchema.methods.checkAvatar = async function () {
  await generateAvatarUrl(this);
  return this.save();
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
