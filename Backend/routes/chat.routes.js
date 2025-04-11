const { Router } = require("express");
const {
  getAllUsersController,
  createGroupController,
} = require("../controllers/chat.controller");
const { validateRequest } = require("../middlewares/validate-request");
const { createGroupSchema } = require("../validators/chat-validators");

const router = Router();
router.get("/users", getAllUsersController);
router.post(
  "/group",
  validateRequest(createGroupSchema),
  createGroupController
);

module.exports = router;
