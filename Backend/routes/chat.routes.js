const { Router } = require("express");
const {
  getAllUsersController,
  createGroupController,
  getGroupMembers,
  getChatMessages,
} = require("../controllers/chat.controller");
const { validateRequest } = require("../middlewares/validate-request");
const {
  createGroupSchema,
  getGroupMembersSchema,
  getChatMessagesSchema,
} = require("../validators/chat-validators");

const router = Router();
router.get("/users", getAllUsersController);
router.post(
  "/messages",
  validateRequest(getChatMessagesSchema),
  getChatMessages
);
router.post(
  "/group/members",
  validateRequest(getGroupMembersSchema),
  getGroupMembers
);
router.post(
  "/group",
  validateRequest(createGroupSchema),
  createGroupController
);

module.exports = router;
