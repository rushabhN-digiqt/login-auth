const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/utils");

const validate = (req, res, next) => {
  const error = validationResult(req);
  if (error.errors.length) {
    // console.log(error.errors[0].msg);
    return errorResponse(res, error.errors, 400);
  } else {
    next();
  }
};
module.exports = validate;
