const express = require("express");
const roomController = require("../controllers/room.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.use(verifyToken);

router.get("/getrooms", roomController.getRooms);
router.get("/availability", roomController.getAvailableRooms);
router.post("/create", roomController.createRoom);
router.patch("/update", roomController.updateRoom);
router.delete("/delete/:id", roomController.deleteRoom);
router.get("/getroom-all-details", roomController.getRoomsAllDetails);

module.exports = router;
