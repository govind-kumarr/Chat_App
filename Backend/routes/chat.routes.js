const { Router } = require("express");
const { getAllUsersController } = require("../controllers/chat.controller");

const router = Router();
router.get("/users", getAllUsersController);

module.exports = router;
