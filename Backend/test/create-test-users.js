const { connectToDb } = require("../db/db");
const { UserModel } = require("../models/User.modal");

require("dotenv").config();

const testUsers = [
  {
    username: "Yash",
    password: "Demo@123",
    confirmPassword: "Demo@123",
    email: "yash@test.com",
  },
  {
    username: "Yash Kuthiyal",
    password: "Demo@123",
    confirmPassword: "Demo@123",
    email: "yashkuthiyal@test.com",
  },
  {
    username: "Dinesh",
    password: "Demo@123",
    confirmPassword: "Demo@123",
    email: "dinesh@test.com",
  },
  {
    username: "varinder",
    password: "Demo@123",
    confirmPassword: "Demo@123",
    email: "varinder@test.com",
  },
  {
    username: "Santosh",
    password: "Demo@123",
    confirmPassword: "Demo@123",
    email: "santosh@test.com",
  },
  {
    username: "Sudip",
    password: "Demo@123",
    confirmPassword: "Demo@123",
    email: "sudip@test.com",
  },
];

const createTestUsers = async () => {
  try {
    const db = await connectToDb();
    await UserModel.insertMany(testUsers);
    console.log(`Users created successfully!`);
  } catch (error) {
    console.error(`Error creating test users`);
  } finally {
    await db.disconnect();
    console.log(`DB disconnected!`);
  }
};

createTestUsers();
