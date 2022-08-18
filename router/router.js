const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const connectDB = require('../Db/connectToDb');
const {
  registrationModel,
  registrationValidation,
  loginValidation,
} = require('../Db/model');
const asyncWrapper = require('../middleware/async');
const { BadRequestErr } = require('../error/index');
const {
  register,
  login,
} = require('../controller/controller');
const UnAuthorizedErr = require('../error/unAuthorizedErr');
const jwt = require('jsonwebtoken');

router.route('/register').post(register);

router.route('/login').post(login);

module.exports = router;
