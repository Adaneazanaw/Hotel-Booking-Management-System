const express = require("express");
const customerController = require("../controllers/customer.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.use(verifyToken);
router.get("/:id/bookings", customerController.getCustomerBookingHistory);

router.get("/getcustomers", customerController.getCustomers);
router.post("/create", customerController.createCustomer);
router.put("/update/:id", customerController.updateCustomer);
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;
