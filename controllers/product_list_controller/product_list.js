
const mongoClient = require('../../db/mongo_connection');
const moment = require('moment');
const log_collections = require('../../db/config').mongo_config.log_collections;
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
const FileUploader = require('../../utilities/file_uploader');
const datavalidator = require('../../models/product_list');
const { validate } = require('uuid');



class product_list_details extends BaseModel {
    constructor() {
        super();
        this.db = mongoClient.getDb().db();
    }

    async add_product_list(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, datavalidator.ProductListAddSchema());
            let current_date = moment().utc().toDate();
            let product_list_collection = this.db.collection(collections.product_list);
            const product_id = await this.getNextUserIdValue();
           /* let merchant_data = await merchant_data_collection.findOne({$or:[{
                merchant_frysto_id : validatedData.merchant_frysto_id
            }]});

            if (merchant_data) {
                throw new CustomError('product_list_error', 400, 'details');
            }
            */
            const payload = {
                product_id:product_id,
                merchant_frysto_id:validatedData.merchant_frysto_id,
                product_english_name:validatedData.product_english_name,
                product_hindi_name:validatedData.product_hindi_name,
                product_price:validatedData.product_price,
                product_mrp:validatedData.product_mrp,
                product_quantity_detail:validatedData.product_quantity_detail,
                product_image_url: validatedData.product_image_url
               

                
            };

            await product_list_collection.insertOne(payload);
            return payload;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'add_product_detail'); 
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
    
    async price_update(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, datavalidator.UpdateProductData());
            let current_date = moment().utc().toDate();
            let product_list_collection = this.db.collection(collections.product_list);

            const find_product = await product_list_collection.findOne({
                product_id:validatedData.product_id
            })

            if(find_product){

                await product_list_collection.findOneAndUpdate({product_id:validatedData.product_id}, {$set:{product_mrp:validatedData.product_mrp, product_price:validatedData.product_price}})

                  return 'price_updated';

            };
        
            throw new CustomError(error.message, error.statusCode, 'product id not found'); 
            
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'add_product_detail'); 
        }
    }
    



    //switch product on off

    async productAvailabilityUpdate(productId, status){
        try{
            
        
            let product_list_collection = this.db.collection(collections.product_list);

            const find_product = await product_list_collection.findOne({
                product_id:parseInt(productId)
            })

            console.log(status);

            if(find_product){

               if(status==0){

                await product_list_collection.findOneAndUpdate({product_id:parseInt(productId)}, {$set:{status:true}});
                console.log('change to true');
                return 'price_updated';

               }else if(status==1){
                await product_list_collection.findOneAndUpdate({product_id:parseInt(productId)}, {$set:{status:false}});
                console.log('change to false');

                return 'price_updated';

               }else{
                throw new CustomError(error.message, error.statusCode, 'product id not updated'); 
               }

                  

            }else{
                throw new CustomError(error.message, error.statusCode, 'product id not found'); 

            }
        
            
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'add_product_detail'); 
        }
    }
    
    async onboard_list(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, datavalidator.OnboardingProductData());
            let current_date = moment().utc().toDate();
            let product_list_collection = this.db.collection(collections.onboard_product_list);
            
            const payload ={
                onboard_product_name:validatedData.master_product_name,
                onboard_product_image_url:validatedData.master_product_image,
                onboard_product_quantity_detail: validatedData.master_product_detail,
                onboard_product_mrp:validatedData.master_product_mrp
            };
            
            await product_list_collection.insertOne(payload); 
            
            
            return 'product_onboarded';
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'add_product_detail'); 
        }
    }
    

    async getProductListMerchant(merchant_frysto_id){
        try{
            const product_list_collection = this.db.collection(collections.product_list);
            let productList;
            
                productList = await product_list_collection.find({ merchant_frysto_id: parseInt(merchant_frysto_id) }).sort({status:-1, product_hindi_name:1}).toArray();
            
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }

    async getCarouselImage(){
        try{
            const carousel_list_collection = this.db.collection(collections.carousel_image);
            let carouselList;
            
                carouselList = await carousel_list_collection.find({carousel_status:true},
                    {
                        projection:{
                            "carousel_link":1
                        }
                    }
                ).toArray();
            
            return carouselList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }

    async getProductListCustomer(merchant_frysto_id){
        try{
            const product_list_collection = this.db.collection(collections.product_list);
            let productList;
            
                productList = await product_list_collection.find({ merchant_frysto_id: parseInt(merchant_frysto_id), status:true },
                {
                    projection:{
                        "_id":1,
                        "merchant_frysto_id":1,
                        "product_english_name":1,
                        "product_hindi_name":1,
                        "product_id":1,
                        "product_image_url":1,
                        "product_mrp":1,
                        "product_price":1,
                        "product_quantity_detail":1,
                        "tag":1
                    }
                }
                ).sort({sort_order:1 ,product_hindi_name: 1, status: 1}).toArray();
           
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }



}

module.exports = product_list_details;





