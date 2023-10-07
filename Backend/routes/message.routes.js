const { Router } = require("express");
const {
  saveMessageCont,
  getAllMessages,
} = require("../controllers/message.controller");

const router = Router();

router.get("/", getAllMessages);
router.post("/message", saveMessageCont);

module.exports = router;
