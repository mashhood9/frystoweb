const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const masterListSchema = {
    masterListAddSchema: () => {
        return Joi.object().keys({
            category_id: Joi.number().integer().required(),
            product_name: Joi.string().required().trim().regex(regex.only_alphabets).label('product_name').error(()=> 'Invalid product_name'),
            product_description: Joi.string().required().trim().regex(regex.only_alphabets).label('product_description').error(()=> 'Invalid product_description'),
        });
      },
      masterListUpdateSchema: () => {
        return Joi.object().keys({
            master_id: Joi.number().integer().required(),
            category_id: Joi.number().integer().required(),
            product_name: Joi.string().required().trim().regex(regex.only_alphabets).label('product_name').error(()=> 'Invalid product_name'),
            product_description: Joi.string().required().trim().regex(regex.only_alphabets).label('product_description').error(()=> 'Invalid product_description'),
        });
      }
};
module.exports = masterListSchema;