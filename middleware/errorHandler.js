const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../error/customErr');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res
      .status(err.statusCode)
      .json({ msg: err.message });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: 'We have an internal error' });
};

module.exports = errorHandler;
