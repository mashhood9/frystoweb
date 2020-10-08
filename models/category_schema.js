const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const categoryTypeSchema = {
    categoryAddSchema: () => {
        return Joi.object().keys({
            category_name: Joi.string().required().trim().regex(regex.only_alphabets).label('category_type').error(()=> 'Invalid category_type'),
            category_description: Joi.string().required().trim().regex(regex.only_alphabets).label('category_description').error(()=> 'Invalid category_description'),
        });
      },
    categoryUpdateSchema: () => {
        return Joi.object().keys({
            category_id: Joi.number().integer().required(),
            category_name: Joi.string().trim().regex(regex.only_alphabets).label('category_type').error(()=> 'Invalid category_type'),
            category_description: Joi.string().trim().regex(regex.only_alphabets).label('category_description').error(()=> 'Invalid category_description'),
        });
      }
};
module.exports = categoryTypeSchema;