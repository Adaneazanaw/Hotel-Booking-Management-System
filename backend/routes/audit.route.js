const express = require("express");
const verifyToken = require("../utils/verifyUser");
const { requireRole } = require("../utils/authorize");
const controller = require("../controllers/audit.controller");

const router = express.Router();
router.use(verifyToken, requireRole("admin", "manager"));
router.get("/", controller.listAuditLogs);

module.exports = router;