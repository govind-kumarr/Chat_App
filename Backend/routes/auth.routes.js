const { Router } = require("express");
const {
  userRegister,
  userLogin,
  userLogout,
} = require("../controllers/auth.controller");

const router = Router();

router.post("/user-register", userRegister);
router.post("/user-login", userLogin);
router.post("/logout", userLogout)


module.exports = router;
