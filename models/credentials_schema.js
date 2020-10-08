const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const credentialsSchema = {
    signup: () => {
        return Joi.object().keys({
          email: Joi.string().lowercase().regex(regex.email).required().label('Email').error(()=> 'Invalid Email'),
          first_name: Joi.string().trim().regex(regex.only_alphabets).required().label('First Name').error(()=> 'Invalid First Name'),
          last_name: Joi.string().trim().regex(regex.only_alphabets).required().label('Last Name').error(()=> 'Invalid Last Name'),
          password: Joi.string().required().label('Password').error(()=> 'Invalid Password'),
          mobile_number: Joi.number().required().label('Mobile Number').error(()=> 'Invalid Mobile Number'),
          user_role: Joi.number().required().label('User Role').error(()=> 'Invalid User Role'),
        })
    },
    signin: () => {
      return Joi.object().keys({
        email: Joi.string().lowercase().regex(regex.email).required().label('Email').error(()=> 'Invalid Email'),
        password: Joi.string().required().label('Password').error(()=> 'Invalid Password')
      })
    },
    address: () => {
      return Joi.object().keys({
        user_id: Joi.number().integer().required(),
        address_1: Joi.string().trim().required().label('address_1').error(()=> 'Invalid address_1'),
        address_2: Joi.string().trim().required().label('address_2').error(()=> 'Invalid address_2'),
        city: Joi.string().trim().regex(regex.only_alphabets).required().label('city').error(()=> 'Invalid city'),
        post_code: Joi.number().required().label('post_code').error(()=> 'Invalid post_code'),
      })
    },
    forgot_password: () => {
      return Joi.object().keys({
        mobile_number: Joi.number().required().label('Mobile Number').error(()=> 'Invalid Mobile Number'),
      })
    },
    verify_token: () => {
      return Joi.string().required().label('Token').error(()=> 'Invalid Token');
    },
    reset_password: () => {
      return Joi.object().keys({
        mobile_number: Joi.number().required().label('Mobile Number').error(()=> 'Invalid Mobile Number'),
        //reset_password_token: Joi.string().required().label('Token').error(()=> 'Invalid Reset Password Token'),
        reset_password_token: Joi.number().required().label('Token').error(()=> 'Invalid token'),
        password: Joi.string().required().label('Password').error(()=> 'Invalid Password')
      })
    },
    change_password: () => {
      return Joi.object().keys({
        new_password: Joi.string().required().label('New Password').error(()=> 'Invalid New Password'),
        old_password: Joi.string().required().label('Old Password').error(()=> 'Invalid Old Password')
      })
    },
    check_duplicate_email: () => {
      return Joi.object().keys({
        mobile_number: Joi.number()
      })
    },
    verify_current_password: () => {
      return Joi.object().keys({
        password: Joi.string().required().label('Password').error(()=> 'Invalid Password')
      })
    }
};

module.exports = credentialsSchema;
