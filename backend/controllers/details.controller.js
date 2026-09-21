const models = require("../models");

function detailsForOverView(req, res) {
  const result = {
    Total_Rooms: 0,
    Available_Rooms: 0,
    Total_Check_In: 0,
    Total_Customers: 0,
    Active_Customers: 0,
    Total_Revenue: 0,
    Monthly_Revenue: 0,
  };

  Promise.all([
    models.Room.count(),
    models.Room.count({ where: { status: "available" } }),
    models.Booking.count({ where: { status: "checked_in" } }),
    models.Customer.count(),
    models.Customer.count(),
    models.sequelize.query(
      `SELECT COALESCE(SUM((julianday(b.date_out) - julianday(b.date_in)) * rc.price), 0) as total
       FROM Bookings b
       LEFT JOIN Rooms r ON b.room_id = r.id
       LEFT JOIN RoomCategories rc ON r.category_id = rc.id
       WHERE b.deletedAt IS NULL AND b.status IN ('confirmed','checked_in','checked_out')`,
      { type: models.sequelize.QueryTypes.SELECT }
    ),
    models.sequelize.query(
      `SELECT COALESCE(SUM((julianday(b.date_out) - julianday(b.date_in)) * rc.price), 0) as total
       FROM Bookings b
       LEFT JOIN Rooms r ON b.room_id = r.id
       LEFT JOIN RoomCategories rc ON r.category_id = rc.id
       WHERE b.deletedAt IS NULL AND b.status IN ('confirmed','checked_in','checked_out')
       AND strftime('%Y-%m', b.createdAt) = strftime('%Y-%m', 'now')`,
      { type: models.sequelize.QueryTypes.SELECT }
    ),
  ])
    .then(
      ([
        totalRooms,
        availableRooms,
        checkIns,
        totalCustomers,
        activeCustomers,
        totalRevenue,
        monthlyRevenue,
      ]) => {
        result.Total_Rooms = totalRooms;
        result.Available_Rooms = availableRooms;
        result.Total_Check_In = checkIns;
        result.Total_Customers = totalCustomers;
        result.Active_Customers = activeCustomers;
        result.Total_Revenue = Math.round(totalRevenue[0]?.total || 0);
        result.Monthly_Revenue = Math.round(monthlyRevenue[0]?.total || 0);

        res.status(200).json({
          success: true,
          message: "Overview details fetched successfully",
          data: [result],
        });
      }
    )
    .catch((err) => {
      console.error("Error fetching overview details:", err);
      res.status(500).json({
        success: false,
        error: "An error occurred while fetching overview details.",
      });
    });
}

async function getReports(req, res) {
  try {
    const [rooms, bookings, customers, payments] = await Promise.all([
      models.Room.findAll({ attributes: ["status"] }),
      models.Booking.findAll({ attributes: ["status", "date_in", "date_out"], include: [{ model: models.Room, include: [models.RoomCategory] }] }),
      models.Customer.count(),
      models.Payment.findAll({ where: { payment_status: "success" }, attributes: ["amount"] }),
    ]);
    const occupancy = rooms.length ? Math.round((rooms.filter((room) => room.status === "occupied").length / rooms.length) * 100) : 0;
    const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const byStatus = bookings.reduce((result, booking) => {
      result[booking.status] = (result[booking.status] || 0) + 1;
      return result;
    }, {});
    res.json({ success: true, data: { total_rooms: rooms.length, occupancy_rate: occupancy, total_customers: customers, total_revenue: revenue, bookings_by_status: byStatus } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  detailsForOverView: detailsForOverView,
  getReports: getReports,
};
