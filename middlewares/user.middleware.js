const { check } = require("express-validator");

const userMiddleware = [
  check("email", "Email is required").notEmpty(),
  check("mobileNo", "Mobile number is required").notEmpty(),
  check(
    "password",
    "Please enter a password with 6 or more charactera"
  ).isLength({ min: 6 }),
];

const loginMiddleware = [
  check("email", "Please include valid email.").isEmail(),
  check("password", "Please password is required.").exists(),
];

module.exports = { userMiddleware, loginMiddleware };
