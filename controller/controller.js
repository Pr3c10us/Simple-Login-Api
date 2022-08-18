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
const UnAuthorizedErr = require('../error/unAuthorizedErr');
const jwt = require('jsonwebtoken');

const register = asyncWrapper(async (req, res) => {
  await connectDB(process.env.MONGO_URI);

  // Validate form
  const validate = registrationValidation.validate(
    req.body
  );
  const { error: err } = validate;
  if (err) {
    throw new BadRequestErr(err.details[0].message);
  }

  // Hash password and replace password with it
  let { Password } = req.body;
  req.body.Password = bcrypt.hashSync(Password, 10);

  //Create User
  await registrationModel.create(req.body);

  //Assign Token
  let {
    Firstname,
    Lastname,
    Country,
    username: Username,
    email,
  } = req.body;

  const token = jwt.sign(
    { Firstname, Lastname, Country, Username, email },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  res.header('token', token);
  res.status(StatusCodes.ACCEPTED).json({
    msg: `${req.body.Firstname} your account has been created`,
  });
});

const login = asyncWrapper(async (req, res) => {
  // check if username or email is provided
  const { username, Password } = req.body;
  if (!username) {
    throw new BadRequestErr(
      'Provide a valid username or email'
    );
  }
  if (!Password) {
    throw new BadRequestErr('Provide a valid Password');
  }

  //validate form
  const validate = loginValidation.validate(req.body);
  const { error: err } = validate;
  if (err) {
    throw new BadRequestErr(err.details[0].message);
  }

  //check if user exist
  let user = await registrationModel.findOne({
    $or: [{ username: username }, { email: username }],
  });
  if (!user) {
    throw new BadRequestErr('User does not exist');
  }

  //Check if password is correct
  const correctPassword = await bcrypt.compare(
    Password,
    user.Password
  );
  if (!correctPassword) {
    throw new UnAuthorizedErr(
      'Password is Wrong, Try again'
    );
  }

  //return Userdata as response
  let outputUser = await registrationModel
    .findOne({
      $or: [{ username: username }, { email: username }],
    })
    .select('-Password');

  // Assign token
  let {
    Firstname,
    Lastname,
    Country,
    username: Username,
    email,
  } = outputUser;

  const token = jwt.sign(
    { Firstname, Lastname, Country, Username, email },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  res.header('token', token);
  res.status(StatusCodes.ACCEPTED).json(outputUser);
});

module.exports = {
  register,
  login,
};
