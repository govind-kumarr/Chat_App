const { Router } = require("express");
const {
  saveMessageCont,
  getAllMessages,
} = require("../controllers/message.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", verifyToken, getAllMessages);
router.post("/message", saveMessageCont);

module.exports = router;
