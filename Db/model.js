const mongoose = require('mongoose');
const joi = require('joi');

const registrationObj = {
  Firstname: {
    type: String,
    required: true,
    max: 20,
  },
  Lastname: {
    type: String,
    required: true,
    max: 20,
  },
  'Date of birth': {
    type: Date,
    required: true,
  },
  Country: {
    type: String,
    required: true,
    max: 30,
  },
  username: {
    type: String,
    required: true,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    max: 20,
  },
  Password: {
    type: String,
    required: true,
    max: 20,
    min: 8,
  },
};

const registrationSchema = mongoose.Schema(registrationObj);
const registrationModel = mongoose.model(
  'registrationModel',
  registrationSchema
);
const registrationValidation = joi.object({
  Firstname: joi.string().required().max(20),
  Lastname: joi.string().required().max(20),
  'Date of birth': joi.date().required(),
  Country: joi.string().required().max(30),
  username: joi.string().required().max(20),
  email: joi.string().required().email(),
  Password: joi.string().required().max(20).min(8),
});

const loginValidation = joi.object({
  username: joi.string(),
  Password: joi.string().required().max(20).min(8),
});

module.exports = {
  registrationModel,
  registrationValidation,
  loginValidation,
};
