const express = require("express");
const detailsController = require("../controllers/details.controller");
const verifyToken = require("../utils/verifyUser");

const router = express.Router();

router.use(verifyToken);
router.get("/reports", detailsController.getReports);

router.get("/details-overview", detailsController.detailsForOverView);

module.exports = router;
