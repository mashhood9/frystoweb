const Joi = require('@hapi/joi');
//const regex = require('../utilities/regex').regex_config;

const userDetailsSchema = {
  general_details: () => {
    return Joi.object().keys({
      first_name: Joi.string(),
      last_name: Joi.string(),
      display_name: Joi.string(),
      password: Joi.string(),
      avatar: Joi.string(),
      about_me: Joi.string(),
      gender : Joi.string()
    });
  },
  user_personal_details: {
    personal_information: () => {
      return Joi.object().keys({
        citizenship: Joi.string(),
        place_of_birth: Joi.string(),
        marital_status: Joi.string(),
        date_of_birth: Joi.string(),
        identification_type: Joi.string(),
        identification_number: Joi.string()
      });
    },
    residential_information: () => {
      return Joi.object().keys({
        city: Joi.string(),
        state: Joi.string(),
        country_code: Joi.number().integer(),
        address: Joi.string(),
        postal_code: Joi.number().integer()
      });
    },
    contact_information: () => {
      return Joi.object().keys({
        email: Joi.string().email({
          minDomainSegments : 2
        }),
        mobile_number: Joi.number()
      });
    }
  },
};
module.exports = userDetailsSchema;