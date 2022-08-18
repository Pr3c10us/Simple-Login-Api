const bcrypt = require('bcryptjs');
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
//
//
//
//
//
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
  let { Password, username, email } = req.body;
  req.body.Password = bcrypt.hashSync(Password, 10);

  //check if username or email exist before
  let userExist = await registrationModel
    .findOne({
      $or: [{ username: username }, { email: email }],
    })
    .select('-Password');
  if (userExist) {
    if (username == userExist.username) {
      throw new BadRequestErr(
        `username ${username} already belongs to another user`
      );
    }
    if (email == userExist.email) {
      throw new BadRequestErr(
        `email has already been used to create an account`
      );
    }
  }

  //Create User
  await registrationModel.create(req.body);
  let user = await registrationModel
    .findOne({ username: username })
    .select('_id');

  // Send new user a token
  let id = user._id;
  const token = jwt.sign(
    { username, id },
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
//
//
//
//
//
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

  // Assign token
  let id = user._id;
  const token = jwt.sign(
    { username, id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );

  res.header('token', token);
  res
    .status(StatusCodes.ACCEPTED)
    .json({ msg: `Welcome ${user.Firstname}` });
});
//
//
//
//
//
module.exports = {
  register,
  login,
};
