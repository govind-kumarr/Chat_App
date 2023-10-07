const { Router } = require("express");
const { userRegister, userLogin } = require("../controllers/auth.controller");

const router = Router();

router.post("/user-register", userRegister);
router.post("/user-login", userLogin);


module.exports = router;
