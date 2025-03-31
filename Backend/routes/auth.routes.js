const { Router } = require("express");
const {
  userRegister,
  userLogin,
  userLogout,
  googleAuthHandler,
  verifySession,
} = require("../controllers/auth.controller");
const { validateSession } = require("../middlewares/auth.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validators/auth-validators");
const { validateRequest } = require("../middlewares/validate-request");

const router = Router();

router.get("/verify-session", validateSession, verifySession);
router.post("/user-register", validateRequest(registerSchema), userRegister);
router.post("/user-login", validateRequest(loginSchema), userLogin);
router.get("/google-auth", googleAuthHandler);
router.post("/logout", userLogout);

module.exports = router;
