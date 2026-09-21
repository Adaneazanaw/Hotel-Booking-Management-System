const express = require("express");
const verifyToken = require("../utils/verifyUser");
const controller = require("../controllers/feedback.controller");

const router = express.Router();
router.use(verifyToken);
router.get("/", controller.listFeedback);
router.post("/", controller.createFeedback);

module.exports = router;
