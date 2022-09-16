const { v4 } = require("uuid");
const User = require("../../models/User");
const { errorResponse, successResponse } = require("../../utils/utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const addNewUser = async (req, res) => {
  try {
    const { email, mobileNo, password } = req.body;
    const emailId = await User.findOne({
      where: {
        email: email,
      },
    });
    const mobile = await User.findOne({
      where: {
        mobileNo: mobileNo,
      },
    });
    if (emailId) {
      console.log(emailId);
      return errorResponse(res, { msg: "Email already exist" });
    }
    if (mobile) {
      return errorResponse(res, { msg: "Mobile no already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptPass = await bcrypt.hash(password, salt);
    const userDetail = await User.create({
      email: email,
      password: encryptPass,
      mobileNo: mobileNo,
      userId: v4(),
    });
    return successResponse(res, { data: userDetail?.userId });
  } catch (err) {
    console.log(err);
    return errorResponse(res, { msg: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password, otpBased } = req.body;
  if (!otpBased) {
    try {
      let userEmail = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { mobileNo: email }],
        },
      });

      if (!userEmail) errorResponse(res, { message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, userEmail?.password);
      if (!isMatch)
        return errorResponse(res, { message: "Invalid credentials" });
      let payLoad = {
        user: {
          id: userEmail.userId,
        },
      };
      const accessToken = await jwt.sign(payLoad, process.env.JWTKEY, {
        expiresIn: 900,
      });
      return successResponse(res, { token: accessToken });
    } catch (err) {
      console.log(err);
      return errorResponse(res, { msg: "Internal server error" });
    }
  }
};

const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    let userEmail = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!userEmail)
      return errorResponse(res, { msg: "Email or Mobile no not exist" });
    // console.log(Math.floor(100000 + Math.random() * 900000));
    let otpCode = Math.floor(100000 + Math.random() * 900000);
  } catch (err) {
    console.log(err);
    return errorResponse(res, { msg: "Internal server error" });
  }
};

const allUserEmail = async (req, res) => {
  try {
    const userEmail = await User.findAll({
      where: {
        userId: req.params.user,
      },
      attributes: ["email", "userId"],
    });
    return successResponse(res, { data: userEmail });
  } catch (err) {
    console.log(err);
    return errorResponse(res, { msg: "Internal server error" });
  }
};

module.exports = { addNewUser, loginUser, sendLoginOtp, allUserEmail };
