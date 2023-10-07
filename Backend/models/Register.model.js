const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  image: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true
  }
});

const RegisterModel = mongoose.model("users", registerSchema);

module.exports = {
  RegisterModel,
};
