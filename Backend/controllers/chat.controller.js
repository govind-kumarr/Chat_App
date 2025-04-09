const { getAllUsers } = require("../services/user.services");

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users sent", userss });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  getAllUsersController,
};
