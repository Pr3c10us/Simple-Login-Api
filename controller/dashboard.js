const asyncWrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const { registrationModel } = require('../Db/model');
const {
  BadRequestErr,
  UnAuthorizedErr,
} = require('../error/index');
const jwt = require('jsonwebtoken');
//
//
//
//
//
const dashboard = asyncWrapper(async (req, res) => {
  // get user token
  let { authorization } = req.headers;
  if (
    !authorization ||
    !authorization.startsWith('Bearer')
  ) {
    throw new BadRequestErr(
      'Provide a token that must be prefixed with "Bearer" before you can access data'
    );
  }
  authorization = authorization.split(' ');
  token = authorization[1];

  try {
    //verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    //Getting user data
    let { id, username } = decoded;
    const user = await registrationModel
      .findOne({
        _id: id,
        username: username,
      })
      .select('-Password');

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    throw new UnAuthorizedErr(
      'You are not permited to access this data'
    );
  }
});

module.exports = dashboard;
