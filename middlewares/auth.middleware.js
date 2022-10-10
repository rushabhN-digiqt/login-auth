const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/utils");

const verifyToken = async (req, res, next) => {
  //   const token = req.header("x-auth-token");
  const beareHeader = req.headers["authorization"];
  if (typeof beareHeader !== "undefined") {
    const bearer = beareHeader.split(" ");
    const bearerToken = bearer[1];
    if (!bearerToken)
      return errorResponse(res, { msg: "No token, authorization denied" });
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWTKEY);
      req.user = decoded.user;
      next();
    } catch (error) {
      errorResponse(res, { meg: "Token is not valid" });
    }
  }
};
module.exports = verifyToken;
