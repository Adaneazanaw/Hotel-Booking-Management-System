const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../utils/verifyUser");
const { requireRole } = require("../utils/authorize");

const router = express.Router();

router.use(verifyToken);
router.get("/me", userController.getCurrentUser);
router.put("/update/:id", userController.updateUser);
router.put("/updateuser/:id", requireRole("admin", "manager"), userController.updateUser);

router.use(requireRole("admin", "manager"));
router.get("/getusers", userController.getUsers);
router.post("/create", userController.createUser);
router.delete("/delete/:id", userController.deleteUser);
router.get("/getcustomers", userController.getCustomers);

module.exports = router;
