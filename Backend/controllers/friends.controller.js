const { RegisterModel } = require("../models/Register.model");

const getFriendsFromDb = async (filter = {}) => {
  try {
    const friends = await RegisterModel.find(filter);
    return friends;
  } catch (error) {
    console.log("Error While getting friends from database", error);
    throw new Error("Couldn't find friends from database");
  }
};

const getFriendsController = async (req, res) => {
  try {
    const friends = await getFriendsFromDb();
    res.json(friends);
  } catch (error) {
    console.log("Error while sending friends", error);
    res.status(500).json({
      message: "Error while sending friends",
    });
  }
};

module.exports = {
  getFriendsController,
};
