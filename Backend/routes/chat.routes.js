const { Router } = require("express");
const {
  getAllUsersController,
  createGroupController,
  getGroupMembers,
} = require("../controllers/chat.controller");
const { validateRequest } = require("../middlewares/validate-request");
const {
  createGroupSchema,
  getGroupMembersSchema,
} = require("../validators/chat-validators");

const router = Router();
router.get("/users", getAllUsersController);
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
