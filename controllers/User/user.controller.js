const { v4 } = require("uuid");
const User = require("../../models/User");
const {
  errorResponse,
  successResponse,
  generateOtp,
  generateToken,
  encryptedString,
  decryptedString,
  addMinutes,
} = require("../../utils/utils");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

// New user Registration API
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

    const encryptPass = await encryptedString(password);

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

//Login api with email/mobile and password and with otp
const loginUser = async (req, res) => {
  const { email, password, otpBased, otp } = req.body;
  if (!otpBased) {
    try {
      let userEmail = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { mobileNo: email }],
        },
      });
      if (!userEmail) errorResponse(res, { message: "Invalid credentials" });

      const isMatch = await decryptedString(password, userEmail?.password);
      if (!isMatch)
        return errorResponse(res, { message: "Invalid credentials" });

      const accessToken = generateToken(userEmail.userId);
      return successResponse(res, { token: accessToken });
    } catch (err) {
      console.log(err);
      return errorResponse(res, { msg: "Internal server error" });
    }
  } else {
    try {
      let userEmail = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { mobileNo: email }],
        },
      });
      if (!userEmail)
        return errorResponse(res, { message: "Invalid credentials" });

      const isMatch = await decryptedString(otp, userEmail?.otp);
      if (!isMatch) return errorResponse(res, { msg: "Incorrect otp!" });

      if (otpBased && otp === "")
        return errorResponse(res, { msg: "Otp required!" });

      // Expired otp validation
      let currentMinutes =
        (await Math.floor(new Date().getTime() / (1000 * 60))) - 1;
      let expiryMinute =
        (await Math.floor(
          new Date(userEmail.expiration_time).getTime() / (1000 * 60)
        )) - 1;
      if (expiryMinute < currentMinutes) {
        userEmail.expiration_time = null;
        userEmail.otp = null;
        userEmail.save();
        return errorResponse(res, { msg: "otp expired!" });
      }

      const accessToken = generateToken(userEmail.userId);

      userEmail.otp = null;
      userEmail.expiration_time = null;
      await userEmail.save();

      return successResponse(res, { token: accessToken });
    } catch (err) {
      console.log(err);
      return errorResponse(res, { msg: "Internal server error" });
    }
  }
};

// Send Login otp API
const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    let userEmail = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { mobileNo: email }],
      },
    });
    if (!userEmail)
      return errorResponse(res, { msg: "Email or Mobile no not exist" });

    let otpCode = await generateOtp();
    const now = new Date();
    const expiryTime = await addMinutes(now, 1);
    const encryptOtp = await encryptedString(otpCode.toString());
    userEmail.otp = encryptOtp;
    userEmail.expiration_time = expiryTime;
    await userEmail.save();
    console.log(otpCode);
    console.log(userEmail);

    return successResponse(res, { msg: "otp was successfully sent." });
  } catch (err) {
    console.log(err);
    return errorResponse(res, { msg: "Internal server error" });
  }
};

//Get user info with passing with token
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

module.exports = {
  addNewUser,
  loginUser,
  sendLoginOtp,
  allUserEmail,
};
