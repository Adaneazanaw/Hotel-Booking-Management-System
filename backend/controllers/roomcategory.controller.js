const models = require("../models");

// Get all room categories
function getRoomCategories(req, res) {
  models.RoomCategory.findAll({ order: [["createdAt", "DESC"]] })
    .then((roomcategories) => {
      res.status(200).json({
        success: true,
        roomcategories: roomcategories,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Create a new room category
function createRoomCategory(req, res) {
  const { category_name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  models.RoomCategory.create({
    category_name,
    price,
    description,
    image,
  })
    .then(() => {
      res.status(201).json({
        success: true,
        message: "Room category created successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Update room category
function updateRoomCategory(req, res) {
  const { id } = req.params;
  const { category_name, price, description } = req.body;
  const image = req.file ? req.file.filename : null;

  const updateData = { category_name, price, description };
  if (image) updateData.image = image;

  models.RoomCategory.update(updateData, { where: { id } })
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Room category updated successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Soft delete room category
function deleteRoomCategory(req, res) {
  const { id } = req.params;

  models.RoomCategory.destroy({ where: { id } })
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Room category deleted successfully",
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
  getRoomCategories: getRoomCategories,
  createRoomCategory: createRoomCategory,
  deleteRoomCategory: deleteRoomCategory,
  updateRoomCategory: updateRoomCategory,
};
