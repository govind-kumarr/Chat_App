const { Router } = require("express");
const {
  userRegister,
  userLogin,
  userLogout,
  googleAuthHandler,
  verifyUser,
} = require("../controllers/auth.controller");
const { validateSession } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/verify-session", validateSession, verifyUser);
router.post("/user-register", userRegister);
router.post("/user-login", userLogin);
router.get("/google-auth", googleAuthHandler);
router.post("/logout", userLogout);

module.exports = router;
