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



class AdminOrderController extends BaseModel {
    constructor() {
        super();
        this.db = mongoClient.getDb().db();
    }



    async getAllOrder(){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            productList = await order_list_collection.find({}).sort({"order_id": -1}).toArray();
            
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }


    async getAllOnlineOrderToRefund(){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            productList = await order_list_collection.find({mode_of_payment:'ONLINE', return_total_price:{$ne:0}, refund_status:'Pending'}).sort({"order_id": -1}).toArray();
            
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }

   



    async refundPartialOrder(order_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            

            let order_to_refund= await order_list_collection.findOne({order_id:parseInt(order_id), refund_status:'Pending'});
            if(order_to_refund){
                const order = await order_list_collection.findOne({order_id : parseInt(order_id)});
                let refund_ammount = order.return_total_price
                let delivery_charge = order.delivery_charge
                let paymentid = order.payment_id

                let total_refund_ammount = parseInt(refund_ammount)-parseInt(delivery_charge);
                console.log(total_refund_ammount);

                var instance = new Razorpay({
                    key_id: rzp_api,
                    key_secret: rzp_key_secret
                  })

               await instance.payments.refund(paymentid, {parseInt(total_refund_ammount)},
                (error, response) => {
                    if (error) {
                      console.log(error)
                    } else {
                      console.log(response.body);
                      await order_list_collection.findOne({order_id : parseInt(order_id)}, {$set:{refund_status:"Initiated"}});

                    }
                  });

                
                 console.log('refund online done through rzp API');

                 return 'done'



            }else{
                throw new CustomError(error.message, error.statusCode, 'order id not found or some error')

            }

        
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }



}

module.exports = AdminOrderController;





