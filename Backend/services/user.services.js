const { UserModel } = require("../models/User.modal");
const bcrypt = require("bcrypt");

const createUser = async (userData) => {
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
    ...userData,
    username,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  const userObject = newUser.toJSON();
  return userObject;
};

const matchPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
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

module.exports = {
  createUser,
  verifyUser,
  getUserById,
  getAllUsers,
};
