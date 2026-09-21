const express = require("express");
const verifyToken = require("../utils/verifyUser");
const controller = require("../controllers/payment.controller");

const router = express.Router();
router.use(verifyToken);
router.get("/", controller.listPayments);
router.post("/", controller.createPayment);
router.patch("/:id/status", controller.updatePaymentStatus);

module.exports = router;
