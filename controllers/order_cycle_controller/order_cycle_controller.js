const mongoClient = require('../../db/mongo_connection');
const log_collections = require('../../db/config').mongo_config.log_collections;
const config = require('../../db/config').mongo_config;
var request = require('request');
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
const FileUploader = require('../../utilities/file_uploader');
const Razorpay = require('razorpay');
const ordervalidator = require('../../models/order_cycle_schema');
const moment = require('moment');



class Order extends BaseModel {
    constructor() {
        super();
        this.db = mongoClient.getDb().db();
    }

   async addOrderOnline(data){
        try{
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, ordervalidator.OrderListAddSchema());
           
            let order_collection = this.db.collection(collections.order_list);
            let frysto_order_id = await this.getNextUserIdValue();
            let current_date = moment().utc().toDate();
            let rzp_id;
            let otp = Math.floor(1000 + Math.random() * 9000);
            

            var instance = new Razorpay({ key_id: 'rzp_test_iB0O6ZbG60hFox', key_secret: 'h6wJkCrlmPXnpYn9H6B28i8S' })
            var options = {
                amount:((validatedData.total_price)*100 ),  // amount in the smallest currency unit
                currency: "INR",
                receipt: frysto_order_id.toString()
              };
              
             await instance.orders.create(options, function(err, order) {
                 console.log(order)
                
                rzp_id=order.id
                console.log(rzp_id);
                });

             const payload = {
                order_id:frysto_order_id,
                razorpay_order_id:rzp_id,
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
                payment_id:'null',
                payment_status:'order initiated',
                order_otp:otp,
                return_product_list:'null',
                return_total_price:0,
                return_time:'null',
                paid_applying_offer:validatedData.total_price,
                
                
            };

            await order_collection.insertOne(payload);

            
          
            return ({order_id:frysto_order_id, razorpay_id:rzp_id})
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'addOrder'); 
        }
    }
    async addReturnOrder(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, ordervalidator.ReturnOrderList());
           
            let return_order_collection = this.db.collection(collections.return_order_list);
            let order_collection = this.db.collection(collections.order_list);
            let current_date = moment().utc().toDate();
            
            
             const find_order = await order_collection.findOne({
                order_id:validatedData.order_id
            })
            if(find_order){
                order_collection.findOneAndUpdate({order_id:validatedData.order_id} , {$set:{return_total_price:validatedData.return_total_price, return_time:current_date}})
               };
            const payload = {
                order_id:validatedData.order_id,
                return_product_list:validatedData.return_product_list,
                total_price:validatedData.total_price,
                return_total_price:validatedData.return_total_price,
                mode_of_payment:validatedData.mode_of_payment,
                return_time:current_date,
                
                
            };

            await return_order_collection.insertOne(payload);
            return payload;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'Return order list'); 
        }
    }
    
    
    
    

    async getOrderByUserId(user_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(user_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.find({ user_id: parseInt(user_id) },
                                                               {
                       projection: {
                            "return_order_list":0,
                           }
                        }).toArray();
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
                productList = await order_list_collection.find({merchant_frysto_id: parseInt(merchant_id)}).toArray();
            }
            return ({order:productList});
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
            return ({order:productList});
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
                            "total_price":1,
                            "return_total_price":1,
                        }
                    });
            }
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
    
     async getReturnOrderListByUserId(order_id){
        try{
            const order_list_collection = this.db.collection(collections.return_order_list);
            let productList;
            if(order_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.findOne({ order_id: parseInt(order_id) },
                                                               {
                        projection: {
                            "return_product_list":1,
                            "mode_of_payment":1,
                            "total_price":1,
                            "return_total_price":1,
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
    
    async orderonlinepaymentconfirmation(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, ordervalidator.OrderStatusConfirmation());
            let paid_after_offer;
           
            let order_collection = this.db.collection(collections.order_list);
            const find_order = await order_collection.findOne({
                razorpay_order_id:validatedData.rzp_order_id
            })
           if(find_order){
               
                 let pymnt_id=validatedData.payment_id
                 
                 let url = 'https://rzp_test_iB0O6ZbG60hFox:h6wJkCrlmPXnpYn9H6B28i8S@api.razorpay.com/v1/payments/'+ pymnt_id ;
                 request.get(url, function (error, response, body) {
                 console.log('Response:', body);
                 const obj = JSON.parse(body);
                 console.log(body.amount);
                 paid_after_offer=((obj.amount));
                 console.log('mashhood');
                 console.log(paid_after_offer)
                  order_collection.findOneAndUpdate({razorpay_order_id:validatedData.rzp_order_id} , {$set:{payment_id:validatedData.payment_id, paid_applying_offer:paid_after_offer, payment_status:validatedData.payment_status, }})
                   });
               console.log(paid_after_offer)
                

                return 'done';

            }

    
            throw new CustomError(error.message, error.statusCode, 'payment not accepted'); 
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





