const { Router } = require("express");
const { getAvatar, uploadFile } = require("../controllers/file.controller");

const router = Router();

router.get("/avatar/*", getAvatar);
router.post("/upload", uploadFile);

module.exports = router;
