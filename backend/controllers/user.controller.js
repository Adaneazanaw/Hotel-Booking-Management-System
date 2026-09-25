const models = require("../models");
const bcrypt = require("bcrypt");

function getCurrentUser(req, res) {
  models.User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
}

function getUsers(req, res) {
  models.User.findAll()
    .then((users) => {
      res.status(200).json({
        success: true,
        users: users,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

function createUser(req, res) {
  const {
    username,
    firstname,
    lastname,
    phone,
    email,
    password,
    role,
    profilepicurl,
  } = req.body;

  models.User.create({
    username,
    firstname,
    lastname,
    phone,
    email,
    password,
    role,
    profilepicurl,
  })
    .then((user) => {
      res.status(201).json({
        success: true,
        user: user,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    });
}

function updateUser(req, res) {
  const { id } = req.params;

  if (
    !req.user ||
    (Number(req.user.id) !== Number(id) &&
      !["admin", "manager"].includes(req.user.role))
  ) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action",
    });
  }

  const allowedFields = [
    "username",
    "firstname",
    "lastname",
    "phone",
    "email",
    "role",
    "profilepicurl",
    "password",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields to update",
    });
  }

  if (updates.password) {
    const saltRounds = 10;
    updates.password = bcrypt.hashSync(updates.password, saltRounds);
  }

  return models.User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return user.update(updates).then((updatedUser) => {
        res.status(200).json({
          success: true,
          user: updatedUser,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
}

function deleteUser(req, res) {
  const { id } = req.params;

  models.User.findByPk(id).then((user) => {
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
    } else {
      user
        .destroy()
        .then(() => {
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
          });
        })
        .catch((err) => {
          res.status(400).json({
            success: false,
            message: err.message,
          });
        });
    }
  });
}

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

module.exports = {
  getCurrentUser: getCurrentUser,
  getUsers: getUsers,
  createUser: createUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  getCustomers: getCustomers,
};
