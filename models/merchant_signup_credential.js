const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const MerchantcredentialsSchema = {
    merchant_signup: () => {
        return Joi.object().keys({
          email: Joi.string().lowercase().regex(regex.email).required().label('Email').error(()=> 'Invalid Email'),
          first_name: Joi.string().trim().regex(regex.only_alphabets).required().label('First Name').error(()=> 'Invalid First Name'),
          last_name: Joi.string().trim().regex(regex.only_alphabets).required().label('Last Name').error(()=> 'Invalid Last Name'),
          mobile_number: Joi.number().required().label('Mobile Number').error(()=> 'Invalid Mobile Number'),
      
        })
    },
    merchant_signin: () => {
      return Joi.object().keys({
        mobile_number: Joi.number().integer().required(),
      })
    },

    merchant_otpverify: () => {
      return Joi.object().keys({
        // email: Joi.string().lowercase().regex(regex.email).required().label('Email').error(()=> 'Invalid Email'),
        // password: Joi.string().required().label('Password').error(()=> 'Invalid Password')
        otp_number: Joi.number().required().label('OTP Number').error(()=> 'Invalid OTP Number'),
        otp_token: Joi.string().trim().required().label('tokenotp').error(()=> 'Invalid TokenOtp'),

      })
    },
    merchant_data_detail_validator: () => {
      return Joi.object().keys({
        email: Joi.string().lowercase().regex(regex.email).required().label('Email').error(()=> 'Invalid Email'),
        merchant_name: Joi.string().trim().required().label('merchant_name').error(()=> 'Invalid merchant_name'),
        shop_name: Joi.string().trim().required().label('shop_name').error(()=> 'Invalid shop_name'),
        mobile_number: Joi.number().integer().required(),
        account_number: Joi.number().integer().required(),
        bank_name: Joi.string().trim().required().label('bank_name').error(()=> 'Invalid bank_name'),
        ifsc_code: Joi.string().trim().required().label('shop_name').error(()=> 'Invalid ifsc_code'),
        delivery_range: Joi.number().integer().required(),
        address: Joi.string().trim().required().label('address').error(()=> 'Invalid address_1'),
        city: Joi.string().trim().required().label('city').error(()=> 'Invalid city'),
        shop_latitude: Joi.number().required(),
        shop_longitude: Joi.number().required(),
        state: Joi.string().trim().regex(regex.only_alphabets).required().label('state').error(()=> 'Invalid city'),
        image_url: Joi.string().trim().required().label('image_url').error(()=> 'Invalid image_url'),
        post_code: Joi.number().required().label('post_code').error(()=> 'Invalid post_code'),
      })
    },

    merchant_data_detail: () => {
      return Joi.object().keys({
        merchant_frysto_id: Joi.number().integer().required(),
        email: Joi.string().lowercase().regex(regex.email).required().label('Email').error(()=> 'Invalid Email'),
        merchant_name: Joi.string().trim().required().label('merchant_name').error(()=> 'Invalid merchant_name'),
        shop_name: Joi.string().trim().required().label('shop_name').error(()=> 'Invalid shop_name'),
        mobile_number: Joi.number().integer().required(),
        account_number: Joi.number().integer().required(),
        bank_name: Joi.string().trim().required().label('bank_name').error(()=> 'Invalid bank_name'),
        ifsc_code: Joi.string().trim().required().label('shop_name').error(()=> 'Invalid ifsc_code'),
        delivery_range: Joi.number().integer().required(),
        address: Joi.string().trim().required().label('address').error(()=> 'Invalid address_1'),
        city: Joi.string().trim().required().label('city').error(()=> 'Invalid city'),
        shop_latitude: Joi.number().required(),
        shop_longitude: Joi.number().required(),
        state: Joi.string().trim().regex(regex.only_alphabets).required().label('state').error(()=> 'Invalid city'),
        image_url: Joi.string().trim().required().label('image_url').error(()=> 'Invalid image_url'),
        post_code: Joi.number().required().label('post_code').error(()=> 'Invalid post_code'),
      })
    },
    forgot_password: () => {
      return Joi.object().keys({
        mobile_number: Joi.number().required().label('Mobile Number').error(()=> 'Invalid Mobile Number'),
      })
    },
};

module.exports = MerchantcredentialsSchema;
