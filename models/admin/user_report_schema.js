const Joi = require('@hapi/joi');

const userReportSchema = {
    filters: () => {
        return Joi.object().keys({
          status: Joi.boolean().truthy('1').falsy('0'),
          new_user: Joi.number()
        });
    },
    admin_send_mail : () => {
      return Joi.number().required()
    },
    admin_change_password: () => {
      return Joi.object().keys({
        id: Joi.number().required(),
        new_password: Joi.string().required()
      })
    }
};

module.exports = userReportSchema;
 