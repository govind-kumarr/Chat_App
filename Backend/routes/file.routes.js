const { Router } = require("express");
const {
  getAvatar,
  uploadFile,
  downloadFile,
} = require("../controllers/file.controller");

const router = Router();

router.get("/getFile/:fileName", downloadFile);
router.get("/avatar/*", getAvatar);
router.post("/upload", uploadFile);

module.exports = router;
