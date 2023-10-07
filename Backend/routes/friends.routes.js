const { Router } = require("express");
const { getFriendsController } = require("../controllers/friends.controller");

const router = Router();

router.get("/", getFriendsController);

module.exports = router;
