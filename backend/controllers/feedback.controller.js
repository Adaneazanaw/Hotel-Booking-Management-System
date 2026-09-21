const models = require("../models");

async function listFeedback(req, res) {
  try {
    const feedback = await models.Feedback.findAll({ order: [["feedback_date", "DESC"]] });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createFeedback(req, res) {
  const { booking_id, customer_name, rating, comments } = req.body;
  if (!booking_id || !customer_name || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ success: false, message: "Booking, customer name, and a rating from 1 to 5 are required" });
  }

  try {
    const booking = await models.Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.status !== "checked_out") {
      return res.status(400).json({ success: false, message: "Feedback is available after checkout" });
    }
    const feedback = await models.Feedback.create({ booking_id, customer_name, rating, comments, feedback_date: new Date() });
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { listFeedback, createFeedback };
