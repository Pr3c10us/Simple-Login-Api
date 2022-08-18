const CustomApiError = require('./customErr');
const { StatusCodes } = require('http-status-codes');

class BadRequestErr extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestErr;
