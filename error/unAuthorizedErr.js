const CustomApiError = require('./customErr');
const { StatusCodes } = require('http-status-codes');

class UnAuthorizedErr extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnAuthorizedErr;
