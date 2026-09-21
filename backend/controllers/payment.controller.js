const models = require("../models");

async function listPayments(req, res) {
  try {
    const payments = await models.Payment.findAll({ order: [["createdAt", "DESC"]], include: [{ model: models.Booking }] });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createPayment(req, res) {
  const { booking_id, amount, transaction_id, payment_method, payment_status = "pending" } = req.body;
  if (!booking_id || amount === undefined || Number(amount) < 0) {
    return res.status(400).json({ success: false, message: "Booking ID and a valid amount are required" });
  }
  if (!["cash", "credit_card", "debit_card", "online"].includes(payment_method)) {
    return res.status(400).json({ success: false, message: "Invalid payment method" });
  }

  try {
    const booking = await models.Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    const payment = await models.Payment.create({ booking_id, amount, transaction_id, payment_method, payment_status });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function updatePaymentStatus(req, res) {
  const { id } = req.params;
  const { payment_status } = req.body;
  if (!["pending", "success", "failed"].includes(payment_status)) {
    return res.status(400).json({ success: false, message: "Invalid payment status" });
  }
  try {
    const payment = await models.Payment.findByPk(id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    await payment.update({ payment_status });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

module.exports = { listPayments, createPayment, updatePaymentStatus };
