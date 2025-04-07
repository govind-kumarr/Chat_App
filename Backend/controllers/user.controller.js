const sendUserInfo = async (req, res) => {
  try {
    const user = req.locals.user;
    await user.checkAvatar();
    res
      .status(200)
      .json({ message: "User details sent successfully", user: user.toJSON() });
  } catch (error) {
    res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  sendUserInfo,
};
