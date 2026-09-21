const express = require("express");
const bookingController = require("../controllers/booking.controller");
const bookingMutationController = require("../controllers/booking-mutation.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.use(verifyToken);

router.get("/get-all-details", bookingController.getAllBookingDetails);
router.get("/get-pending-details", bookingController.getPendingBookingDetails);
router.get("/get-checked-in-details", bookingController.getCheckedInBookingDetails);
router.post("/create", bookingMutationController.createBooking);
router.put("/edit", bookingMutationController.editBooking);
router.delete("/cancel/:booking_id", bookingMutationController.cancelBooking);

module.exports = router;
