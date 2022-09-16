const { v4 } = require("uuid");
const User = require("../../models/User");
const { errorResponse, successResponse } = require("../../utils/utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  try {
    const { email, password } = req.body;
    // console.log(otpBased, "----------------");
    let user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) return errorResponse(res, { message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) return errorResponse(res, { message: "Invalid credentials" });
    let payLoad = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payLoad, process.env.JWTKEY, { expiresIn: 900 }, (err, token) => {
      if (err) throw err;
      else {
        return successResponse(res, { data: token });
      }
    });
  } catch (err) {
    console.log(err);
    return errorResponse(res, { msg: "Internal server error" });
  }
};

module.exports = { addNewUser, loginUser };
