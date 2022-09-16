const successResponse = (res, data, code = 200) => {
  return res.status(code).json(data);
};

const errorResponse = (res, data, code) => {
  return res.status(code ? code : 500).json(data);
};

module.exports = { successResponse, errorResponse };
