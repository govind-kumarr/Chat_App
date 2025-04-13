const { Router } = require("express");
const {
  uploadUrl,
  saveFile,
  deleteFile,
} = require("../controllers/file.controller");
const { validateRequest } = require("../middlewares/validate-request");
const { fileSchema, saveFileSchema } = require("../validators/file-validators");

const router = Router();
router.post("/upload", validateRequest(fileSchema), uploadUrl);
router.post("/save", validateRequest(saveFileSchema), saveFile);
router.post("/delete", validateRequest(saveFileSchema), deleteFile);

module.exports = router;
