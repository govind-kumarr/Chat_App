const { SessionModel } = require("../models/Session.modal");
const { UserModel } = require("../models/User.modal");

const validateSession = async (req, res, next) => {
  try {
    const sessionId = req.cookies.chat_app_sid;
    const session = await SessionModel.findById(sessionId);
    if (session) {
      const user = await UserModel.findById(session?.user);
      if (user) {
        req.locals = { user };
        return next();
      }
      throw new Error("User not found");
    } else {
      console.log("token not present");
      throw new Error("Session not found");
    }
  } catch (error) {
    res.status(401).json({
      authenticated: false,
      message: error.message || "Something went wrong",
    });
    return;
  }
};

module.exports = { validateSession };
