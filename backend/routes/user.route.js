const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyUser");
const { requireRole } = require("../utils/authorize");

const router = express.Router();

router.use(verifyToken, requireRole("admin", "manager"));

router.get("/getusers", userController.getUsers);
router.post("/create", userController.createUser);
router.delete("/delete/:id", userController.deleteUser);
router.get("/getcustomers", userController.getCustomers);

module.exports = router;
