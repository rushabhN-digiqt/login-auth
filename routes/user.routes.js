const express = require("express");
const {
  addNewUser,
  loginUser,
  allUserEmail,
  sendLoginOtp,
} = require("../controllers/User/user.controller");
const verifyToken = require("../middlewares/auth.middleware");
const {
  userMiddleware,
  loginMiddleware,
} = require("../middlewares/user.middleware");
const validate = require("../middlewares/validationMiddleware");

const router = express.Router();

router.get("/:user", [verifyToken], allUserEmail);
router.post("/new", [userMiddleware, validate], addNewUser);
router.post("/login", [loginMiddleware, validate], loginUser);
router.post("/send-otp", sendLoginOtp);

module.exports = router;
