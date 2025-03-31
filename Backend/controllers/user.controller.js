const { UserModel } = require("../models/User.modal");

const sendUserInfo = async (req, res) => {
  try {
    const user = req.locals.user.toJSON();
    delete user["password"];
    res.status(200).json({ message: "User details sent successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  sendUserInfo,
};
