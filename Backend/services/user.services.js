const { UserModel } = require("../models/User.modal");
const bcrypt = require("bcrypt");
const { verifyJwt } = require("../utils/jwt.utils");

const createUser = async (userData) => {
  try {
    const { username, email, password } = userData;

    // Check if username or email already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      if (existingUser.username === username)
        throw new Error("Username is already taken");
      if (existingUser.email === email)
        throw new Error("Email is already registered");
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const userObject = newUser.toJSON();
    return userObject;
  } catch (error) {
    console.log(`Error occured: ${error?.message}`);
  }
};

const matchPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const doUserExist = async (email) => {
  try {
    if (!email) return false;
    const userExist = await UserModel.findOne({ email });
    return !!userExist?.email ? userExist : false;
  } catch (error) {
    console.log(`Error: ${error?.message}`);
  }
};

const verifyUser = async (userData) => {
  const { email, password } = userData || {};
  const userExist = await UserModel.findOne({
    $or: [{ email }, { username: email }],
  });

  if (userExist) {
    const isMatch = await matchPassword(password, userExist?.password);
    if (isMatch) return userExist;
    throw new Error("Email/Password is incorrect");
  }
  throw new Error("User doesn't exist");
};

const getUserById = async (userId) => {
  const user = await UserModel.findById(userId);
  return user;
};

const getAllUsers = async () => {
  const users = await UserModel.find({}).select("-password");
  return users;
};

const getActiveUsers = async () => {
  return await UserModel.find({ isActive: true });
};

const changeStatus = async (userId = "", isActive = false, socketId = "") => {
  return await UserModel.findByIdAndUpdate(userId, {
    isActive,
    socketId,
    lastActiveAt: isActive ? null : new Date(),
  });
};

const checkPasswordReset = async (userId) => {
  const user = await UserModel.findById(userId);
  const tokenExpiry = user?.resetTokenExpiry;
  const resetToken = user?.resetPasswordToken;
  return tokenExpiry || resetToken;
};

const verifyToken = async (token) => {
  const tokenUser = await UserModel.findOne({ resetPasswordToken: token });
  const { valid, expired, decoded } = verifyJwt(token);
  return {
    valid:
      valid &&
      tokenUser?.email &&
      !expired &&
      decoded.email === tokenUser?.email,
    decoded,
    tokenUser,
  };
};

module.exports = {
  createUser,
  verifyUser,
  getUserById,
  getAllUsers,
  getActiveUsers,
  changeStatus,
  doUserExist,
  checkPasswordReset,
  verifyToken,
};
