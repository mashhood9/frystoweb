const Joi = require('@hapi/joi');
const regex = require('../utilities/regex').regex_config;

const OrderListSchema = {
    OrderListAddSchema: () => {
        return Joi.object().keys({
            merchant_frysto_id: Joi.number().integer(),
            user_id: Joi.number().integer(),
            user_id_address: Joi.string().trim().label('invalid user_address').error(()=> 'Invalid invalid user_address'),
            product_list:Joi.array().items(Joi.object({
                item_product_id:Joi.number().integer(),
                item_merchant_frysto_id:Joi.number().integer(),
                item_english_name:Joi.string().required().label('english_name').error(()=> 'Invalid english_name'),
                item_hindi_name:Joi.string().required().trim().label('hindi_name').error(()=> 'Invalid hindi_name'),
                item_price:Joi.number().integer(),
                item_quantity:Joi.number().integer(),
                item_mrp:Joi.number().integer(),
                item_quantity_detail:Joi.string().required().trim().label('quantity detail').error(()=> 'Invalid quantity detail'),
                item_image_url:Joi.string().required().trim().label('image_url').error(()=> 'Invalid image url'),
            })),
            product_description: Joi.string().trim().regex(regex.only_alphabets).label('product_description').error(()=> 'Invalid product_description'),
            total_price:Joi.number().integer(),
            status:  Joi.string().trim().regex(regex.only_alphabets).label('Status').error(()=> 'order_status'),
            mode_of_payment:Joi.string().trim().regex(regex.only_alphabets).label('mode of payment').error(()=> 'mode of payment invalid'),
            delivery_time:Joi.string().trim().regex(regex.only_alphabets).label('delivery time').error(()=> 'delivery time'),

        });
      },
    OrderStatus:()=>{
        return Joi.object().keys({
            order_id:Joi.number().integer(),
            order_status: Joi.string().required().trim().regex(regex.only_alphabets).label('order_status').error(()=> 'Invalid order_status'),

        });
    }
};
module.exports = OrderListSchema;
