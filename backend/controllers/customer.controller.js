const models = require("../models");

// Get all customers
function getCustomers(req, res) {
  models.Customer.findAll({ order: [["createdAt", "DESC"]] })
    .then((customers) => {
      res.status(200).json({
        success: true,
        customers: customers,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Create a new customer
function createCustomer(req, res) {
  const { p_name, p_contact_no, p_email } = req.body;

  if (!p_name || !p_contact_no || !p_email) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  models.Customer.create({
    name: p_name,
    contact_no: p_contact_no,
    email: p_email,
  })
    .then(() => {
      res.status(201).json({
        success: true,
        message: "Customer created successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Update customer
function updateCustomer(req, res) {
  const { id } = req.params;
  const { p_name, p_contact_no, p_email } = req.body;

  models.Customer.update(
    { name: p_name, contact_no: p_contact_no, email: p_email },
    { where: { id } }
  )
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

// Delete customer (soft delete)
function deleteCustomer(req, res) {
  const { id } = req.params;

  models.Customer.destroy({ where: { id } })
    .then(() => {
      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

async function getCustomerBookingHistory(req, res) {
  try {
    const customer = await models.Customer.findByPk(req.params.id, {
      include: [{ model: models.Booking, order: [["date_in", "DESC"]] }],
    });
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getCustomers: getCustomers,
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  deleteCustomer: deleteCustomer,
  getCustomerBookingHistory: getCustomerBookingHistory,
};
