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
  check("email", "Email or Mobile  is required.").notEmpty(),
  // check("password", "Password is required.").notEmpty(),
];

module.exports = { userMiddleware, loginMiddleware };
