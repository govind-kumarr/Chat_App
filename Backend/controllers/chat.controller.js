const { getAllUsers } = require("../services/user.services");

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ message: "Users sent", users });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

const createGroupController = async (req, res) => { // Refactor it
  try {
    const { participants, name, avatar } = req.body;
    const chat = await createChat('group', participants);
    res.status(200).json({ message: "Group created successfully", users });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  getAllUsersController,
  createGroupController
};
