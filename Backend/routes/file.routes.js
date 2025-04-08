const { Router } = require("express");
const { uploadUrl, saveFile } = require("../controllers/file.controller");
const { validateRequest } = require("../middlewares/validate-request");
const { fileSchema, saveFileSchema } = require("../validators/file-validators");

const router = Router();
router.post("/upload", validateRequest(fileSchema), uploadUrl);
router.post("/save", validateRequest(saveFileSchema), saveFile);

module.exports = router;
