var GeoPoint = require('geopoint');
const mongoClient = require('../../db/mongo_connection');
const moment = require('moment');
const log_collections = require('../../db/config').mongo_config.log_collections;
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
const FileUploader = require('../../utilities/file_uploader');
const datavalidator = require('../../models/merchant_signup_credential');



class merchant_data_details extends BaseModel {
    constructor() {
        super();
        this.db = mongoClient.getDb().db();
    }

    async add_merchant_detail(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, datavalidator.merchant_data_detail());
            let current_date = moment().utc().toDate();
            let merchant_data_collection = this.db.collection(collections.merchant_data_detail);
            const order_id = await this.getNextUserIdValue();
            let merchant_data = await merchant_data_collection.findOne({$or:[{
                merchant_frysto_id : validatedData.merchant_frysto_id
            }]});

            if (merchant_data) {
                throw new CustomError('merchant_data_already  exist', 400, 'details');
            }
            
            const payload = {
                merchant_frysto_id:validatedData.merchant_frysto_id,
                merchant_name: validatedData.merchant_name,
                shop_name:validatedData.shop_name,
                mobile_number:validatedData.mobile_number,
                delivery_range:validatedData.delivery_range,
                address: validatedData.address,
                city:validatedData.city,
                shop_latitude:validatedData.shop_latitude,
                shop_longitude:validatedData.shop_longitude,
                state:validatedData.state,
                post_code:validatedData.post_code,
                date:current_date,
                image_url:validatedData.image_url

                
            };

            await merchant_data_collection.insertOne(payload);
            return payload;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'add_merchant_detail'); 
        }
    }

    async getListByPosition(user_latitude, user_longitude){
        try{
            const merchant_list = this.db.collection(collections.merchant_data_detail);
            var GeoPoint = require('geopoint');
            var lat1= parseFloat(user_latitude);
            var long1= parseFloat(user_longitude);

            
            


            let productList;

            productList= await merchant_list.find( {} ).toArray();

            function distance_match(lat1, long1, lat2, long2){
                var point1 = new GeoPoint(lat1, long1);
                var point2 = new GeoPoint(lat2, long2);
                var distance = point1.distanceTo(point2, true)
              return distance; 
             }
            

             var filter_store= productList.filter(function(list) {
                 console.log(distance_match(lat1, long1, list.shop_latitude, list.shop_longitude) );
                 return  distance_match(lat1, long1, list.shop_latitude, list.shop_longitude) < list.delivery_range ;
                 
             })




            
            
            return filter_store;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
    // user data is fetched from here------------------

        async getUserByUserId(UserId){
            try{
                const order_list_collection = this.db.collection(collections.user);
                let Userdata;
                if(UserId){

                    Userdata = await order_list_collection.findOne({ user_id: parseInt(UserId) },
                     {
                    
                projection: {
                    "user_id": 1,
                    "is_mobile_verified": 1,
                    "email":1,
                    "mobile_number":1,
                    "first_name":1,
                    "last_name":1,

                    
                }

             } );
        }
        return ({user_id:Userdata.user_id, email:Userdata.email,mobile_number:Userdata.mobile_number, first_name:Userdata.first_name, last_name:Userdata.last_name})                                            
            } catch(error){
                console.log(error);
                throw new CustomError(error.message, error.statusCode, 'userdata'); 
            }
        }
    
    
    async getOrderByMerchantId(merchant_id){
        try{
            const order_list_collection = this.db.collection(collections.order_list);
            let productList;
            if(merchant_id === 0){
                productList = await order_list_collection.find({}).toArray();
            } else {
                productList = await order_list_collection.find({ merchant_id: parseInt(merchant_id) }).toArray();
            }
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }

    async getNextUserIdValue() {
        let collection = this.db.collection(collections.merchant_counters);
        let sequenceDocument = await collection.findOneAndUpdate(
            { _id: "user_id" },
            { $inc: { "sequence_value": 1 } },
            { new: true, returnOriginal: false, }
        );
        return sequenceDocument.value.sequence_value;
    }

}

module.exports = merchant_data_details;





