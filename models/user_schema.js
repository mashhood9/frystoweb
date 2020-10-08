const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const userSchema = {
    userDetailUpdate: () => {
        return Joi.object().keys({
            user_id: Joi.number().integer().required(),
            first_name: Joi.string().trim().regex(regex.only_alphabets).label('First Name').error(()=> 'Invalid First Name'),
            last_name: Joi.string().trim().regex(regex.only_alphabets).label('Last Name').error(()=> 'Invalid Last Name'),
        });
      },
      userProfilePic : () => {
        return Joi.object().keys({
            token: Joi.string().required(),
            image : Joi.string().required()
        });
      }
};
module.exports = userSchema;