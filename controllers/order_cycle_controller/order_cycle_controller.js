const mongoClient = require('../../db/mongo_connection');
const log_collections = require('../../db/config').mongo_config.log_collections;
const config = require('../../db/config').mongo_config;
var request = require('request');
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
const FileUploader = require('../../utilities/file_uploader');
const Razorpay = require('razorpay');
const ordervalidator = require('../../models/order_cycle_schema');
const moment = require('moment-timezone');
const needle = require('needle');
const rzp_api = process.env.API_KEY_ID;
const rzp_key_secret = process.env.RZP_API_KEY_SECRET;
const extl_api_key = process.env.EXTL_API_KEY;
const extl_api_token = process.env.EXTL_API_TOKEN;
const https = require('https');



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
            let merchant_collection = this.db.collection(collections.merchant_data_detail);
            let user_collection = this.db.collection(collections.users);
            let frysto_order_id = await this.getNextUserIdValue();
            let current_date =moment().tz("Asia/Kolkata").format("dddd, MMMM Do YYYY, h:mm A");
            let rzp_id;
            let otp = Math.floor(1000 + Math.random() * 9000);
            let merchant_detail;
            let user_detail;
            

            var instance = new Razorpay({ key_id: rzp_api, key_secret: rzp_key_secret })
            var options = {
                amount:((validatedData.total_price) ),  // amount in the smallest currency unit
                currency: "INR",
                receipt: frysto_order_id.toString()
              };
              
             await instance.orders.create(options, function(err, order) {
                 console.log(order)
                
                rzp_id=order.id
                console.log(rzp_id);
                });
             merchant_detail = await merchant_collection.findOne({merchant_frysto_id:validatedData.merchant_frysto_id});
             console.log(merchant_detail);
             const merchant_obj = merchant_detail;
             let mchnt_name = merchant_obj.shop_name
             user_detail = await user_collection.findOne({user_id:validatedData.user_id});
             const user_obj = user_detail;
             let usr_name = user_obj.first_name
             let usr_mobile_number= user_obj.mobile_number

            

             const payload = {
                order_id:frysto_order_id,
                razorpay_order_id:rzp_id,
                user_id: validatedData.user_id,
                merchant_frysto_id:validatedData.merchant_frysto_id,
                user_id_address:validatedData.user_id_address,
                product_list:validatedData.product_list,
                product_description:validatedData.product_description,
                total_price:validatedData.total_price,
                delivery_charge:validatedData.delivery_charge,
                status:validatedData.status,
                mode_of_payment:validatedData.mode_of_payment,
                delivery_time:validatedData.delivery_time,
                order_time_date: current_date,
                payment_id:'null',
                payment_status:'order_initiated',
                order_otp:otp,
                return_product_list:'null',
                return_total_price:0,
                return_time:'null',
                paid_applying_offer:validatedData.total_price,
                shop_name:mchnt_name,
                user_mobile_number:usr_mobile_number,
                user_name:usr_name,
                settelment_status:'Not Setteled',
                refund_status:'No Returns'

               
                
                
            };

            await order_collection.insertOne(payload);

            
          
            return ({order_id:frysto_order_id, razorpay_id:rzp_id})
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'addOrder'); 
        }
    }
    
    async addOrderCOD(data){
        try{
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, ordervalidator.OrderListAddSchema());
           
            let order_collection = this.db.collection(collections.order_list);
            let merchant_collection = this.db.collection(collections.merchant_data_detail);
            let user_collection = this.db.collection(collections.users);
            let frysto_order_id = await this.getNextUserIdValue();
            let current_date = moment().tz("Asia/Kolkata").format("dddd, MMMM Do YYYY, h:mm A");
            let otp = Math.floor(1000 + Math.random() * 9000);
            let merchant_detail;
            let user_detail;
            

//             var instance = new Razorpay({ key_id: 'rzp_test_iB0O6ZbG60hFox', key_secret: 'h6wJkCrlmPXnpYn9H6B28i8S' })
//             var options = {
//                 amount:((validatedData.total_price) ),  // amount in the smallest currency unit
//                 currency: "INR",
//                 receipt: frysto_order_id.toString()
//               };
              
//              await instance.orders.create(options, function(err, order) {
//                  console.log(order)
                
//                 rzp_id=order.id
//                 console.log(rzp_id);
//                 });
             merchant_detail = await merchant_collection.findOne({merchant_frysto_id:validatedData.merchant_frysto_id});
             console.log(merchant_detail);
             const merchant_obj = merchant_detail;
             let mchnt_name = merchant_obj.shop_name
             user_detail = await user_collection.findOne({user_id:validatedData.user_id});
             const user_obj = user_detail;
             let usr_name = user_obj.first_name
             let usr_mobile_number= user_obj.mobile_number

             this.OrderStatusMsg91(validatedData.status, frysto_order_id , usr_mobile_number, validatedData.total_price);

             const payload = {
                order_id:frysto_order_id,
                razorpay_order_id:'COD',
                user_id: validatedData.user_id,
                merchant_frysto_id:validatedData.merchant_frysto_id,
                user_id_address:validatedData.user_id_address,
                product_list:validatedData.product_list,
                product_description:validatedData.product_description,
                total_price:validatedData.total_price,
                delivery_charge:validatedData.delivery_charge,
                status:validatedData.status,
                mode_of_payment:validatedData.mode_of_payment,
                delivery_time:validatedData.delivery_time,
                order_time_date: current_date,
                payment_id:'null',
                payment_status:'on_delivery',
                order_otp:otp,
                return_product_list:'null',
                return_total_price:0,
                return_time:'null',
                paid_applying_offer:validatedData.total_price,
                shop_name:mchnt_name,
                user_mobile_number:usr_mobile_number,
                user_name:usr_name,
                settelment_status:'Not Setteled',
                refund_status:'No Returns'
               
                
                
            };

            await order_collection.insertOne(payload);

            
          
            return ({order_id:frysto_order_id})
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
            let current_date =  moment().tz("Asia/Kolkata").format("dddd, MMMM Do YYYY, h:mm A");

            let return_order= await return_order_collection.findOne({order_id:validatedData.order_id})
            
            if(!return_order){
                const find_order = await order_collection.findOne({
                    order_id:validatedData.order_id
                })
                if(find_order){
                  await  order_collection.findOneAndUpdate({order_id:validatedData.order_id} , {$set:{return_total_price:validatedData.return_total_price, return_time:current_date, delivery_charge:validatedData.delivery_charge, refund_status:'Pending' }})
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

            }else{
                console.log(error);
                throw new CustomError(error.message, error.statusCode, 'Return order already done'); 

            }
            
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'Return order list'); 
        }
    }
    
    // merchant to user call
    async connectMerchantToUser(OrderId){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            const merchant_list = this.db.collection(collections.merchant_data_detail);
            let order_detail;
            let merchant_detail;

            order_detail = await order_list_collection.findOne({order_id:parseInt(OrderId)});
            console.log(order_detail);
            const order_data = order_detail;
            let mchnt_id = order_data.merchant_frysto_id;
            let user_mobile_number= order_data.user_mobile_number;


            merchant_detail = await merchant_list.findOne({merchant_frysto_id:parseInt(mchnt_id)});
            console.log(merchant_detail);
            const merchant_obj = merchant_detail;
            let mchnt_number = merchant_obj.mobile_number;


            var dataString = 'From=0' + String(mchnt_number) + '&To=0' + String(user_mobile_number) + '&CallerId=08047188008';
            console.log(dataString);

            var options = {
                url: 'https://'+ extl_api_key +':'+ extl_api_token +'@api.exotel.com/v1/Accounts/frysto2/Calls/connect?'+ String(dataString),
                method: 'POST',
            };


            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
            request(options, callback);
            console.log('done')

            return 'Call Connected';

        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }


    // delivery boy to user call


    async connectDeliveryToUser(OrderId){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            const merchant_list = this.db.collection(collections.merchant_data_detail);
            let order_detail;
            let merchant_detail;

            order_detail = await order_list_collection.findOne({order_id:parseInt(OrderId)});
            console.log(order_detail);
            const order_data = order_detail;
            let mchnt_id = order_data.merchant_frysto_id;
            let user_mobile_number= order_data.user_mobile_number;


            merchant_detail = await merchant_list.findOne({merchant_frysto_id:parseInt(mchnt_id)});
            console.log(merchant_detail);
            const merchant_obj = merchant_detail;
            let delivery_number = merchant_obj.delivery_boy_mobile_number;


            var dataString = 'From=0' + String(delivery_number) + '&To=0' + String(user_mobile_number) + '&CallerId=08047188008';
            console.log(dataString);

            var options = {
                url: 'https://'+ extl_api_key +':'+ extl_api_token +'@api.exotel.com/v1/Accounts/frysto2/Calls/connect?'+ String(dataString),
                method: 'POST',
            };


            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
            request(options, callback);
            console.log('done')

            return 'Call Connected';

        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
    
    

    async getOrderByUserId(user_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(user_id === 0){
                productList = await order_list_collection.find({}).sort({"order_id": -1}).toArray();
            } else {
                productList = await order_list_collection.find({ user_id: parseInt(user_id), payment_status: { $ne: "order_initiated" } }).sort({_id:-1}).toArray();
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

    async getToDeliverOrderByMerchantId(merchant_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
             productList = await order_list_collection.find({merchant_frysto_id: parseInt(merchant_id), status: "Accepted" }).sort({_id:-1}).toArray();
            return ({order:productList});
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }




    
    async getOrderSettelmentStatusByMerchantId(merchant_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
           
              productList = await order_list_collection.find({merchant_frysto_id: parseInt(merchant_id), status:'Delivered'},
              {
                  projection: {
                    "order_id": 1,
                    "razorpay_order_id": 1,
                    "user_id": 1,
                    "merchant_frysto_id": 1,
                    "user_id_address": 1,
                    "product_description": 1,
                    "total_price": 1,
                    "status": 1,
                    "mode_of_payment":1,
                    "delivery_time": 1,
                    "order_time_date": 1,
                    "payment_id": 1,
                    "payment_status": 1,
                    "order_otp": 1,
                    "return_product_list": 1,
                    "return_total_price": 1,
                    "return_time": 1,
                    "paid_applying_offer": 1,
                    "shop_name": 1,
                    "user_mobile_number": 1,
                    "user_name": 1,
                    "settelment_status":1,
                  }
              }
              ).toArray();
            
            return (productList);
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getSettelmentList'); 
        }
    }

    
      async pendingOrderByMerchantId(merchant_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(merchant_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.find({merchant_frysto_id: parseInt(merchant_id) , status: "Pending", payment_status: { $ne: "order_initiated" } }).sort({_id:-1}).toArray();
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
                productList = await order_list_collection.findOne({ order_id: parseInt(order_id) });
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

    async checkOrderOtp(OrderId, otp){
        try{
            let order_list_collection = this.db.collection(collections.order_list);

            const find_order = await order_list_collection.findOne({
                order_id:parseInt(OrderId),
                order_otp:parseInt(otp)
            });

            if(find_order){


                let order_collection = this.db.collection(collections.order_list);  
               const order_detail = await order_collection.findOne({order_id:parseInt(OrderId)});
                let mode_of_payment = order_detail.mode_of_payment;

                if(mode_of_payment=='COD'){
                    await order_list_collection.findOneAndUpdate({order_id:parseInt(OrderId), order_otp:parseInt(otp) },{ $set:{ status: "Delivered", refund_status:'COD' } } );

                    return 'done'
                }else{

                    await order_list_collection.findOneAndUpdate({order_id:parseInt(OrderId), order_otp:parseInt(otp) },{ $set:{ status: "Delivered" } } );
                    return 'done'

                }


                

                

            }else {
                throw new CustomError(error.message, error.statusCode, 'orderId not found'); 
            }

            
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
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
                 
                 let url = 'https://' + rzp_api + ':' + rzp_key_secret + '@api.razorpay.com/v1/payments/'+ pymnt_id ;
                 request.get(url, function (error, response, body) {
                 console.log('Response:', body);
                 const obj = JSON.parse(body);
                 console.log(body.amount);
                 paid_after_offer=((obj.amount));
                 console.log('mashhood');
                 console.log(paid_after_offer)
                   order_collection.findOneAndUpdate({razorpay_order_id:validatedData.rzp_order_id} , {$set:{payment_id:validatedData.payment_id, paid_applying_offer:paid_after_offer, payment_status:'Paid', }})
                   });
               console.log(paid_after_offer)
               let order_id=order_collection.findOne({razorpay_order_id:validatedData.rzp_order_id});
                

                return (order_id);

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


    async OrderStatusMsg91(status, id, number,amount ) {

        let mobile_number = "91" + String(number)
        let total_amount = "Rs." + String(amount)
        let final_status = String(status)
        let order_id = "ID" + String(id)


        const data = JSON.stringify({
            "flow_id": "608d315c1a91bf72b63ec83a",
            "mobiles": mobile_number,
            "status": final_status,
            "id": order_id,
            "amount":total_amount,
            "instalink":"https://instagram.com/frysto_india"
          })
          
          const options = {
            hostname: 'api.msg91.com',
            port: 443,
            path: '/api/v5/flow/',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key':'344558AVO73xXuTvj608924b4P1',
              'Content-Length': data.length
            }
          }
          
          const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
          
            res.on('data', d => {
              process.stdout.write(d)
            })
          })
          
          req.on('error', error => {
            console.error(error)
          })
          
          req.write(data)
          req.end()

    }

}

module.exports = Order;





