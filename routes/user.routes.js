const express = require("express");
const {
  addNewUser,
  loginUser,
} = require("../controllers/User/user.controller");
const {
  userMiddleware,
  loginMiddleware,
} = require("../middlewares/user.middleware");
const validate = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/new", [userMiddleware, validate], addNewUser);
router.post("/login", [loginMiddleware, validate], loginUser);

module.exports = router;
