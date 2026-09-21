const express = require("express");
const roomCategoryController = require("../controllers/roomcategory.controller");
const verifyToken = require("../utils/verifyUser");
const { getUploader } = require("../utils/image-uploader");

const router = express.Router();

const uploadImage = getUploader("room_category").single("image");

router.get("/getroomcategories", roomCategoryController.getRoomCategories);
router.post(
  "/createroomcategory",
  verifyToken,
  uploadImage,
  roomCategoryController.createRoomCategory
);
router.delete(
  "/deleteroomcategory/:id",
  verifyToken,
  roomCategoryController.deleteRoomCategory
);
router.put(
  "/updateroomcategory/:id",
  verifyToken,
  uploadImage,
  roomCategoryController.updateRoomCategory
);

module.exports = router;
