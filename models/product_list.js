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
      },
    
    OnboardingProductData: () => {
        return Joi.object().keys({
            master_product_name: Joi.string().required().trim().label('master product name').error(()=> 'Invalid master product name'),
            master_product_image: Joi.string().required().trim().label('master product image name').error(()=> 'Invalid master product image name'),
            master_product_detail: Joi.string(),
            master_product_mrp: Joi.number().integer().required().label('master product mrp name').error(()=> 'Invalid master product mrp name'),
        })
      }
};
module.exports = ProductListSchema;
