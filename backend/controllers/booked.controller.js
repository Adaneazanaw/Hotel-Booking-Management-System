const models = require("../models");

const CHECKED_DETAILS_QUERY = `
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

// Check in a booking
async function checkIn(req, res) {
  const { booking_id } = req.body;

  if (!booking_id)
    return res.status(400).json({ success: false, message: "Booking ID is required." });

  try {
    await models.sequelize.transaction(async (transaction) => {
      const booking = await models.Booking.findByPk(booking_id, { transaction });
      if (!booking) throw new Error("Booking not found.");
      if (!["pending", "confirmed"].includes(booking.status)) throw new Error("Only confirmed bookings can be checked in.");
      await booking.update({ status: "checked_in" }, { transaction });
      await models.Room.update({ status: "occupied" }, { where: { id: booking.room_id }, transaction });
      await models.Checking.create({ booking_id, status: "checked_in" }, { transaction });
      await models.AuditLog.create({ event_type: "check_in", ref_no: booking.reference_number, room_id: booking.room_id, event_timestamp: new Date() }, { transaction });
    });
    res.status(200).json({ success: true, message: "Check-in completed successfully" });
  } catch (err) {
    res.status(err.message === "Booking not found." ? 404 : 400).json({ success: false, message: err.message });
  }
}

// Check out a booking
async function checkOut(req, res) {
  const { booking_id } = req.body;

  if (!booking_id)
    return res.status(400).json({ success: false, message: "Booking ID is required." });

  try {
    await models.sequelize.transaction(async (transaction) => {
      const booking = await models.Booking.findByPk(booking_id, { transaction });
      if (!booking) throw new Error("Booking not found.");
      if (booking.status !== "checked_in") throw new Error("Only checked-in bookings can be checked out.");
      await booking.update({ status: "checked_out" }, { transaction });
      await models.Room.update({ status: "available" }, { where: { id: booking.room_id }, transaction });
      await models.Checking.create({ booking_id, status: "checked_out" }, { transaction });
      await models.AuditLog.create({ event_type: "check_out", ref_no: booking.reference_number, room_id: booking.room_id, event_timestamp: new Date() }, { transaction });
    });
    res.status(200).json({ success: true, message: "Check-out completed successfully" });
  } catch (err) {
    res.status(err.message === "Booking not found." ? 404 : 400).json({ success: false, message: err.message });
  }
}

// Cancel a check-in (revert booking to confirmed, room to available)
async function cancelCheckIn(req, res) {
  const { ref_no, room_id } = req.body;

  try {
    const booking = await models.Booking.findOne({
      where: { reference_number: ref_no },
    });

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found." });

    await booking.update({ status: "confirmed" });
    if (room_id) {
      await models.Room.update({ status: "available" }, { where: { id: room_id } });
    }

    res.status(200).json({
      success: true,
      message: `Check-in canceled successfully for reference number ${ref_no}.`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while canceling the check-in.",
    });
  }
}

// Edit check-in details
async function editCheckIn(req, res) {
  const { ref_no, new_room_id, name, contact_no, date_in, date_out } = req.body;

  try {
    const booking = await models.Booking.findOne({
      where: { reference_number: ref_no },
    });

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found." });

    const oldRoomId = booking.room_id;

    // Update booking dates and room
    const updateData = {};
    if (date_in) updateData.date_in = date_in;
    if (date_out) updateData.date_out = date_out;
    if (new_room_id) updateData.room_id = new_room_id;

    await booking.update(updateData);

    // Update customer info if provided
    if (name || contact_no) {
      const customerUpdate = {};
      if (name) customerUpdate.name = name;
      if (contact_no) customerUpdate.contact_no = contact_no;
      await models.Customer.update(customerUpdate, {
        where: { id: booking.customer_id },
      });
    }

    // If room changed, update room statuses
    if (new_room_id && new_room_id !== oldRoomId) {
      await models.Room.update({ status: "available" }, { where: { id: oldRoomId } });
      await models.Room.update({ status: "occupied" }, { where: { id: new_room_id } });
    }

    res.status(200).json({
      success: true,
      message: "Check-in details updated successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to edit check-in details.",
    });
  }
}

// Get all checked-in details
function getAllDetailsChecked(req, res) {
  models.sequelize
    .query(
      CHECKED_DETAILS_QUERY +
        " AND b.status IN ('checked_in', 'checked_out') ORDER BY b.createdAt DESC",
      { type: models.sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Checked data fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({ success: false, message: err.message });
    });
}

// Get all checked-out details
function getAllDetailsCheckedOut(req, res) {
  models.sequelize
    .query(
      CHECKED_DETAILS_QUERY +
        " AND b.status = 'checked_out' ORDER BY b.createdAt DESC",
      { type: models.sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Checked out data fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({ success: false, message: err.message });
    });
}

module.exports = {
  checkIn: checkIn,
  checkOut: checkOut,
  cancelCheckIn: cancelCheckIn,
  editCheckIn: editCheckIn,
  getAllDetailsChecked: getAllDetailsChecked,
  getAllDetailsCheckedOut: getAllDetailsCheckedOut,
};
