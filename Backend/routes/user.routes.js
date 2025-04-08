const { Router } = require("express");
const { sendUserInfo } = require("../controllers/user.controller");
const router = Router();

router.get("/info", sendUserInfo);

module.exports = router;
