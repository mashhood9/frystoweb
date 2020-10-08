const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const OrderListSchema = {
    OrderListAddSchema: () => {
        return Joi.object().keys({
            merchant_frysto_id: Joi.number().integer(),
            user_id: Joi.number().integer(),
            user_id_address: Joi.string().required().trim().regex(regex.only_alphabets).label('product_name').error(()=> 'Invalid product_name'),
            product_list:Joi.array().items(Joi.object({
                item_english_name:Joi.string().required().trim().regex(regex.only_alphabets).label('english_name').error(()=> 'Invalid english_name'),
                item_hindi_name:Joi.string().required().trim().regex(regex.only_alphabets).label('hindi_name').error(()=> 'Invalid hindi_name'),
                item_price:Joi.number().integer(),
                item_quantity:Joi.number().integer(),
                item_mrp:Joi.number().integer(),
                item_total_price: Joi.number().integer(),
            })),
            product_description: Joi.string().required().trim().regex(regex.only_alphabets).label('product_description').error(()=> 'Invalid product_description'),
            total_price:Joi.number().integer(),
            status:  Joi.string().required().trim().regex(regex.only_alphabets).label('Status').error(()=> 'order_status'),
            mode_of_payment:Joi.string().required().trim().regex(regex.only_alphabets).label('mode of payment').error(()=> 'mode of payment invalid'),
            delivery_time:Joi.string().required().trim().regex(regex.only_alphabets).label('delivery time').error(()=> 'delivery time'),

        });
      }
};
module.exports = OrderListSchema;