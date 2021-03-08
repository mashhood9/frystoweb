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

    async BulkDeleteProductsAccordingToMerchant(merchant_frysto_id){
        try{
            const order_list_collection = this.db.collection(collections.product_list);
            let productList;
            productList = await order_list_collection.find({merchant_frysto_id:parseInt(merchant_frysto_id)}).remove();
            
            return 'done';
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }

    async refundPartialOrder(order_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            order = await order_list_collection.findOne({order_id : parseInt(order_id)}).toArray();


            
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }



}

module.exports = AdminOrderController;





