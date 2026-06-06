const models = require("../models");

const BOOKING_DETAILS_QUERY = `
  SELECT b.id, b.id as booking_id, b.reference_number, b.room_id, b.customer_id,
         b.date_in, b.date_out, b.status as booking_status,
         b.createdAt, b.updatedAt,
         c.name as customer_name, c.email as customer_email,
         c.contact_no as customer_phone,
         r.room_name, r.category_id, r.status as room_status,
         rc.category_name as room_category_name, rc.price,
         (julianday(b.date_out) - julianday(b.date_in)) * rc.price as total_price
  FROM Bookings b
  LEFT JOIN Customers c ON b.customer_id = c.id
  LEFT JOIN Rooms r ON b.room_id = r.id
  LEFT JOIN RoomCategories rc ON r.category_id = rc.id
  WHERE b.deletedAt IS NULL
`;

// Get all booking details
function getAllBookingDetails(req, res) {
  models.sequelize
    .query(BOOKING_DETAILS_QUERY + " ORDER BY b.createdAt DESC", {
      type: models.sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Booking data fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Get pending booking details
function getPendingBookingDetails(req, res) {
  models.sequelize
    .query(
      BOOKING_DETAILS_QUERY +
        " AND b.status IN ('pending', 'confirmed') ORDER BY b.createdAt DESC",
      { type: models.sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Pending booking data fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Get checked-in booking details
function getCheckedInBookingDetails(req, res) {
  models.sequelize
    .query(
      BOOKING_DETAILS_QUERY +
        " AND b.status = 'checked_in' ORDER BY b.createdAt DESC",
      { type: models.sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Checked-in booking data fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Create a new booking
function createBooking(req, res) {
  const { room_id, customer_id, check_in, check_out } = req.body;

  if (!room_id)
    return res.status(400).json({ success: false, message: "Room ID is required" });
  if (!customer_id)
    return res.status(400).json({ success: false, message: "Customer ID is required" });
  if (!check_in)
    return res.status(400).json({ success: false, message: "Check-in date is required" });
  if (!check_out)
    return res.status(400).json({ success: false, message: "Check-out date is required" });
  if (new Date(check_in) >= new Date(check_out))
    return res.status(400).json({ success: false, message: "Check-in date should be before check-out date" });

  // Check if the room exists and is available
  models.Room.findByPk(room_id)
    .then((room) => {
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      if (room.status.toLowerCase() !== "available") {
        return res.status(400).json({
          success: false,
          message: `Room "${room.room_name}" is currently ${room.status}. Please select a different room.`,
        });
      }

      const reference_number = "BK-" + Date.now();

      return models.Booking.create({
        reference_number,
        room_id,
        customer_id,
        date_in: check_in,
        date_out: check_out,
        status: "confirmed",
      }).then((booking) => {
        // Mark room as occupied immediately
        return models.Room.update(
          { status: "occupied" },
          { where: { id: room_id } }
        ).then(() => {
          res.status(200).json({
            success: true,
            message: `Booking created successfully. Reference: ${reference_number}`,
            data: booking,
          });
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Booking creation failed: " + err.message,
      });
    });
}

// Edit a booking
function editBooking(req, res) {
  const { booking_id, room_id, check_in, check_out } = req.body;

  if (!booking_id)
    return res.status(400).json({ success: false, message: "Booking ID is required" });
  if (!room_id)
    return res.status(400).json({ success: false, message: "Room ID is required" });
  if (!check_in)
    return res.status(400).json({ success: false, message: "Check-in date is required" });
  if (!check_out)
    return res.status(400).json({ success: false, message: "Check-out date is required" });
  if (new Date(check_in) >= new Date(check_out))
    return res.status(400).json({ success: false, message: "Check-in date should be before check-out date" });

  models.Booking.findByPk(booking_id)
    .then((booking) => {
      if (!booking)
        return res.status(404).json({ success: false, message: "Booking not found" });

      const oldRoomId = booking.room_id;

      booking
        .update({
          room_id,
          date_in: check_in,
          date_out: check_out,
        })
        .then(() => {
          // If room changed, update old room to available and new room to occupied
          if (oldRoomId !== room_id) {
            models.Room.update({ status: "available" }, { where: { id: oldRoomId } });
            models.Room.update({ status: "occupied" }, { where: { id: room_id } });
          }
          res.status(200).json({
            success: true,
            message: "Booking edited successfully",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Booking edit failed",
        error: err.message,
      });
    });
}

// Cancel a booking
function cancelBooking(req, res) {
  const { booking_id } = req.params;

  if (!booking_id)
    return res.status(400).json({ success: false, message: "Booking ID is required" });

  models.Booking.findByPk(booking_id)
    .then((booking) => {
      if (!booking)
        return res.status(404).json({ success: false, message: "Booking not found" });

      const roomId = booking.room_id;

      booking
        .update({ status: "cancelled" })
        .then(() => {
          // Set room back to available
          models.Room.update({ status: "available" }, { where: { id: roomId } });
          res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Booking cancellation failed",
        error: err.message,
      });
    });
}

module.exports = {
  getAllBookingDetails: getAllBookingDetails,
  getPendingBookingDetails: getPendingBookingDetails,
  getCheckedInBookingDetails: getCheckedInBookingDetails,
  createBooking: createBooking,
  editBooking: editBooking,
  cancelBooking: cancelBooking,
};
