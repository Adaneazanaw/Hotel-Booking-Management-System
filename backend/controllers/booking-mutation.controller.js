const models = require("../models");

function parseBookingDates(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (!checkIn || !checkOut || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Valid check-in and check-out dates are required";
  }

  if (start >= end) {
    return "Check-in date should be before check-out date";
  }

  return null;
}

async function createBooking(req, res) {
  const { room_id, customer_id, check_in, check_out } = req.body;
  const dateError = parseBookingDates(check_in, check_out);

  if (!room_id || !customer_id) {
    return res.status(400).json({ success: false, message: "Room ID and customer ID are required" });
  }
  if (dateError) {
    return res.status(400).json({ success: false, message: dateError });
  }

  try {
    const result = await models.sequelize.transaction(async (transaction) => {
      const [room, customer] = await Promise.all([
        models.Room.findByPk(room_id, { transaction }),
        models.Customer.findByPk(customer_id, { transaction }),
      ]);

      if (!room) throw new Error("Room not found");
      if (!customer) throw new Error("Customer not found");
      if (room.status.toLowerCase() !== "available") {
        throw new Error(`Room "${room.room_name}" is currently ${room.status}`);
      }

      const reference_number = `BK-${Date.now()}`;
      const booking = await models.Booking.create(
        {
          reference_number,
          room_id: Number(room_id),
          customer_id: Number(customer_id),
          date_in: check_in,
          date_out: check_out,
          status: "confirmed",
        },
        { transaction }
      );

      await room.update({ status: "occupied" }, { transaction });
      await models.AuditLog.create(
        {
          event_type: "booking_created",
          ref_no: reference_number,
          room_id: Number(room_id),
          event_timestamp: new Date(),
        },
        { transaction }
      );

      return booking;
    });

    res.status(201).json({ success: true, message: "Booking created successfully", data: result });
  } catch (error) {
    res.status(error.message === "Room not found" || error.message === "Customer not found" ? 404 : 400).json({
      success: false,
      message: error.message,
    });
  }
}

async function editBooking(req, res) {
  const { booking_id, room_id, check_in, check_out } = req.body;
  const dateError = parseBookingDates(check_in, check_out);

  if (!booking_id || !room_id) {
    return res.status(400).json({ success: false, message: "Booking ID and room ID are required" });
  }
  if (dateError) {
    return res.status(400).json({ success: false, message: dateError });
  }

  try {
    await models.sequelize.transaction(async (transaction) => {
      const booking = await models.Booking.findByPk(booking_id, { transaction });
      const room = await models.Room.findByPk(room_id, { transaction });

      if (!booking) throw new Error("Booking not found");
      if (!room) throw new Error("Room not found");
      if (Number(room_id) !== Number(booking.room_id) && room.status.toLowerCase() !== "available") {
        throw new Error(`Room "${room.room_name}" is currently ${room.status}`);
      }

      const oldRoomId = booking.room_id;
      await booking.update({ room_id: Number(room_id), date_in: check_in, date_out: check_out }, { transaction });

      if (Number(oldRoomId) !== Number(room_id)) {
        await models.Room.update({ status: "available" }, { where: { id: oldRoomId }, transaction });
        await room.update({ status: "occupied" }, { transaction });
      }

      await models.AuditLog.create(
        {
          event_type: "booking_updated",
          ref_no: booking.reference_number,
          room_id: Number(room_id),
          event_timestamp: new Date(),
        },
        { transaction }
      );
    });

    res.status(200).json({ success: true, message: "Booking edited successfully" });
  } catch (error) {
    const status = ["Booking not found", "Room not found"].includes(error.message) ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
}

async function cancelBooking(req, res) {
  const { booking_id } = req.params;

  if (!booking_id) {
    return res.status(400).json({ success: false, message: "Booking ID is required" });
  }

  try {
    await models.sequelize.transaction(async (transaction) => {
      const booking = await models.Booking.findByPk(booking_id, { transaction });
      if (!booking) throw new Error("Booking not found");

      await booking.update({ status: "cancelled" }, { transaction });
      await models.Room.update({ status: "available" }, { where: { id: booking.room_id }, transaction });
      await models.AuditLog.create(
        {
          event_type: "booking_cancelled",
          ref_no: booking.reference_number,
          room_id: booking.room_id,
          event_timestamp: new Date(),
        },
        { transaction }
      );
    });

    res.status(200).json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(error.message === "Booking not found" ? 404 : 400).json({ success: false, message: error.message });
  }
}

module.exports = { createBooking, editBooking, cancelBooking };
