const models = require("../models");

// Get all rooms
function getRooms(req, res) {
  models.Room.findAll({ order: [["createdAt", "DESC"]] })
    .then((rooms) => {
      res.status(200).json({
        success: true,
        rooms: rooms,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

async function getAvailableRooms(req, res) {
  const { check_in, check_out } = req.query;
  if (!check_in || !check_out || new Date(check_in) >= new Date(check_out)) {
    return res.status(400).json({ success: false, message: "Valid check-in and check-out dates are required" });
  }

  try {
    const rooms = await models.Room.findAll({
      where: { status: "available" },
      include: [{ model: models.RoomCategory }],
      order: [["room_name", "ASC"]],
    });
    const bookings = await models.Booking.findAll({
      where: { status: ["pending", "confirmed", "checked_in"] },
      attributes: ["room_id", "date_in", "date_out"],
    });
    const start = new Date(check_in);
    const end = new Date(check_out);
    const reservedRoomIds = new Set(
      bookings
        .filter((booking) => new Date(booking.date_in) < end && new Date(booking.date_out) > start)
        .map((booking) => booking.room_id)
    );
    res.json({ success: true, rooms: rooms.filter((room) => !reservedRoomIds.has(room.id)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Create a new room
function createRoom(req, res) {
  const { room_name, category_id } = req.body;

  models.Room.create({
    room_name,
    category_id,
    status: "available",
  })
    .then(() => {
      res.status(201).json({
        success: true,
        message: "Room created successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Update room
function updateRoom(req, res) {
  const { id, room_name, category_id, status } = req.body;

  models.Room.update(
    { room_name, category_id, status },
    { where: { id } }
  )
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Room updated successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Delete room (soft delete)
function deleteRoom(req, res) {
  const { id } = req.params;

  models.Room.destroy({ where: { id } })
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Room deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Get all room details (joined with RoomCategory)
function getRoomsAllDetails(req, res) {
  models.sequelize
    .query(
      `SELECT r.id, r.room_name, r.category_id, r.status, r.createdAt, r.updatedAt,
              rc.category_name, rc.price, rc.image as category_image, rc.description
       FROM Rooms r
       LEFT JOIN RoomCategories rc ON r.category_id = rc.id
       WHERE r.deletedAt IS NULL
       ORDER BY r.createdAt DESC`,
      { type: models.sequelize.QueryTypes.SELECT }
    )
    .then((rooms) => {
      res.status(200).json({
        success: true,
        rooms: rooms,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

module.exports = {
  getRooms: getRooms,
  getAvailableRooms: getAvailableRooms,
  createRoom: createRoom,
  updateRoom: updateRoom,
  deleteRoom: deleteRoom,
  getRoomsAllDetails: getRoomsAllDetails,
};
