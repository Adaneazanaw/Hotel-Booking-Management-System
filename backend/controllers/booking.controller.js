const models = require("../models");

// total_price uses a dialect-safe day-difference expression:
//   SQLite: julianday(date_out) - julianday(date_in)
//   MySQL:  DATEDIFF(date_out, date_in)
// We detect the dialect at runtime via Sequelize and build the query accordingly.
function buildBookingDetailsQuery(dialect) {
  const dayDiff =
    dialect === "mysql"
      ? "GREATEST(1, DATEDIFF(b.date_out, b.date_in))"
      : "MAX(1, CAST(ROUND(julianday(b.date_out) - julianday(b.date_in)) AS INTEGER))";

  return `
  SELECT b.id, b.id as booking_id, b.reference_number, b.room_id, b.customer_id,
         b.date_in, b.date_out, b.status as booking_status,
         b.createdAt, b.updatedAt,
         c.name as customer_name, c.email as customer_email,
         c.contact_no as customer_phone,
         r.room_name, r.category_id, r.status as room_status,
         rc.category_name as room_category_name, rc.price,
         ${dayDiff} * rc.price as total_price
  FROM Bookings b
  LEFT JOIN Customers c ON b.customer_id = c.id
  LEFT JOIN Rooms r ON b.room_id = r.id
  LEFT JOIN RoomCategories rc ON r.category_id = rc.id
  WHERE b.deletedAt IS NULL
`;
}

// Get all booking details
function getAllBookingDetails(req, res) {
  const query = buildBookingDetailsQuery(models.sequelize.getDialect());
  models.sequelize
    .query(query + " ORDER BY b.createdAt DESC", {
      type: models.sequelize.QueryTypes.SELECT,
    })
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Booking data fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Get pending booking details
function getPendingBookingDetails(req, res) {
  const query = buildBookingDetailsQuery(models.sequelize.getDialect());
  models.sequelize
    .query(
      query +
        " AND b.status IN ('pending', 'confirmed') ORDER BY b.createdAt DESC",
      { type: models.sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Pending booking data fetched successfully",
        data: data,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Get checked-in booking details
function getCheckedInBookingDetails(req, res) {
  const query = buildBookingDetailsQuery(models.sequelize.getDialect());
  models.sequelize
    .query(
      query +
        " AND b.status = 'checked_in' ORDER BY b.createdAt DESC",
      { type: models.sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.status(200).json({
        success: true,
        message: "Checked-in booking data fetched successfully",
        data: data,
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
  getAllBookingDetails,
  getPendingBookingDetails,
  getCheckedInBookingDetails,
};
