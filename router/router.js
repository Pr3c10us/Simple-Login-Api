const router = require('express').Router();
const {
  register,
  login,
} = require('../controller/LoginAndRegistercontroller');
const dashboard = require('../controller/dashboard');

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/dashboard').get(dashboard);

module.exports = router;
