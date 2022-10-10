const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const successResponse = (res, data, code = 200) => {
  return res.status(code).json(data);
};

const errorResponse = (res, data, code) => {
  return res.status(code ? code : 500).json(data);
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const generateToken = (userId) => {
  let payLoad = {
    user: {
      id: userId,
    },
  };
  return jwt.sign(payLoad, process.env.JWTKEY, {
    expiresIn: 900,
  });
};

const encryptedString = async (str) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedStr = await bcrypt.hash(str, salt);
  return encryptedStr;
};

const decryptedString = (bodyStr, dbStr) => {
  return bcrypt.compare(bodyStr, dbStr);
};

const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

module.exports = {
  successResponse,
  errorResponse,
  generateOtp,
  generateToken,
  encryptedString,
  decryptedString,
  addMinutes,
};
