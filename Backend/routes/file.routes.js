const { Router } = require("express");
const { uploadUrl } = require("../controllers/file.controller");
const { validateRequest } = require("../middlewares/validate-request");
const { fileSchema } = require("../validators/file-validators");

const router = Router();
router.post("/upload", validateRequest(fileSchema), uploadUrl);

module.exports = router;
