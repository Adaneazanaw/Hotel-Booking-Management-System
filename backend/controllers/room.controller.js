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
  createRoom: createRoom,
  updateRoom: updateRoom,
  deleteRoom: deleteRoom,
  getRoomsAllDetails: getRoomsAllDetails,
};
