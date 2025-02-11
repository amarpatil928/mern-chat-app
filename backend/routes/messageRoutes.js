const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controllers/messageControllers");

const rounder = express.Router();

rounder.route("/").post(protect, sendMessage);
rounder.route("/:chatId").get(protect, allMessages);

module.exports = rounder;