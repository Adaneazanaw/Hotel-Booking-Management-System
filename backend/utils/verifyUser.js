const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");
const dotenv = require("dotenv");

dotenv.config();

function verifyToken(req, res, next) {
  const token = req.cookies && req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const secret = process.env.JWT_SECRET_KEY || "development-only-secret";
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized x",
      });
    }
    req.user = user;
    next();
  });
}

module.exports = verifyToken;
