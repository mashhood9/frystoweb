const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const ProductListSchema = {
    ProductListAddSchema: () => {
        return Joi.object().keys({
            merchant_frysto_id: Joi.number().integer().required(),
            product_english_name: Joi.string().required().trim().label('english_name').error(()=> 'Invalid invalid_englishname'),
            product_hindi_name: Joi.string().required().trim().label('hindi name').error(()=> 'Invalid product_description'),
            product_price: Joi.number().required(),
            product_mrp: Joi.number().required(),
            product_quantity_detail:Joi.string().required().trim().label('detail').error(()=> 'Invalid detail'),
            product_image_url:Joi.string().required().trim().label('product_image').error(()=> 'Invalid product_image'),
            


        })
      },
    
     UpdateProductData: () => {
        return Joi.object().keys({
            product_id: Joi.number().integer().required(),
            product_price: Joi.number().integer().required(),
            product_mrp:  Joi.number().integer().required(),
        })
      }
};
module.exports = ProductListSchema;
