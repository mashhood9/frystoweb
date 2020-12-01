const mongoClient = require('../../db/mongo_connection');
const log_collections = require('../../db/config').mongo_config.log_collections;
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
const FileUploader = require('../../utilities/file_uploader');
const ordervalidator = require('../../models/order_cycle_schema');
const moment = require('moment');



class Order extends BaseModel {
    constructor() {
        super();
        this.db = mongoClient.getDb().db();
    }

    async addOrder(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, ordervalidator.OrderListAddSchema());
           
            let order_collection = this.db.collection(collections.order_list);
            const order_id = await this.getNextUserIdValue();
            let current_date = moment().utc().toDate();
            const otp = Math.floor(1000 + Math.random() * 9000);
            
            const payload = {
                order_id:order_id,
                user_id: validatedData.user_id,
                merchant_frysto_id:validatedData.merchant_frysto_id,
                user_id_address:validatedData.user_id_address,
                product_list:validatedData.product_list,
                product_description:validatedData.product_description,
                total_price:validatedData.total_price,
                status:validatedData.status,
                mode_of_payment:validatedData.mode_of_payment,
                delivery_time:validatedData.delivery_time,
                order_time_date: current_date,
                order_otp:otp,
                
            };

            await order_collection.insertOne(payload);
            return order_id;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'addAddress'); 
        }
    }

    async getOrderByUserId(user_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(user_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.find({ user_id: parseInt(user_id) },).toArray();
            }
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
    async getOrderByMerchantId(merchant_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(merchant_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.findOne({merchant_frysto_id: parseInt(merchant_id)}).toArray();
            }
            return ({data:productList});
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
    
      async pendingOrderByMerchantId(merchant_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(merchant_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.find({merchant_frysto_id: parseInt(merchant_id) , status: "Pending" }).toArray();
            }
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
    async getOrderListByUserId(order_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(order_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.findOne({ order_id: parseInt(order_id) },
                                                               {
                        projection: {
                            "product_list": 1,
                            "mode_of_payment":1,
                            "total_price":1
                        }
                    });
            }
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
    
     async orderstatusbyMerchant(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, ordervalidator.OrderStatus());
           
            let order_collection = this.db.collection(collections.order_list);
            const find_order = await order_collection.findOne({
                order_id:validatedData.order_id
            })
            if(find_order){
                order_collection.findOneAndUpdate({order_id:validatedData.order_id} , {$set:{status:validatedData.order_status}})

                return 'done';

            }

    
            throw new CustomError(error.message, error.statusCode, 'Not Accepted'); 
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'not Accepted'); 
        }
    }

    async getNextUserIdValue() {
        let collection = this.db.collection(collections.user_counters);
        let sequenceDocument = await collection.findOneAndUpdate(
            { _id: "user_id" },
            { $inc: { "sequence_value": 1 } },
            { new: true, returnOriginal: false, }
        );
        return sequenceDocument.value.sequence_value;
    }

}

module.exports = Order;





