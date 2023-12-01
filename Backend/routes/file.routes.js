const { Router } = require("express");
const {
  getAvatar,
  uploadFile,
  downloadFile,
} = require("../controllers/file.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/getFile/:fileName",verifyToken,downloadFile )
router.get("/avatar/*", getAvatar);
router.post("/upload", verifyToken, uploadFile);

module.exports = router;
