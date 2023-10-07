const { Router } = require("express");
const { getAvatar } = require("../controllers/file.controller");

const router = Router();

router.get("/avatar/*", getAvatar);

module.exports = router;
