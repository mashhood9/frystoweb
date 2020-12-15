var GeoPoint = require('geopoint');
const needle = require('needle');
const bcrypt = require('bcrypt');
const mongoClient = require('../../db/mongo_connection');
let authToken = require('../../utilities/jwt.auth');
let crypto = require('../../utilities/crypto');
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


    async merchant_authentication(merchantId_data){
        try{
          // const last_login_time = moment().utc().format('DD-MM-YYYY HH:mm:ss');
          let signin_data = await this.validateModelSchema(merchantId_data, datavalidator.merchant_signin());
          const last_login_time = moment().utc().toDate();
          const last_login_type = 'normal';
          let collection = this.db.collection(collections.merchant_data_detail);
          let result = await collection.findOne({
              mobile_number: signin_data.mobile_number,
          }, {
                  projection: {
                     "mobile_number":1
                  }
              });
          if (result) {
             // if (!result.is_mobile_verified) {
               //   throw new CustomError('Mobile not verified', 400, 'signin');
             // };

              // if (!result.password) {
              //     throw new CustomError('Password not set for normal login.', 400, 'signin');
              // };

              // let match = await bcrypt.compare(signin_data.password, result.password);

              // if (match) {
              //     await collection.updateOne(
              //         { 
              //             email: signin_data.email.toString().toLowerCase()
              //         },
              //         {
              //             $set: {
              //                 'last_login_time': last_login_time,
              //                 'last_login_type': last_login_type
              //             }
              //         });

              //     let jwt_token = await authToken.encrypt({
              //         user_id: result.user_id,
              //         email: result.email,
              //         user_role : result.user_role
              //     });
                 
              //     let token= crypto.encrypt(jwt_token);

              //     return ({user_id:result.user_role, user_name:result.first_name, token});
              // } else {
              //     throw new CustomError('Invalid Email/Password', 400, 'signin');
              // }
              const needle = require('needle');
              var sessionId;
              
              var otpId=Math.floor(100000 + Math.random() * 900000).toString();
              var baseurl='https://2factor.in/API/V1/74ab6f7a-fc1c-11ea-9fa5-0200cd936042/SMS/';
              var mobile_num= merchantId_data.mobile_number,
              
              url = baseurl.concat(mobile_num.toString(),'/',otpId,'/','OTP')
              console.log(otpId);



                needle.get(url, {json: true}, (err, res) => {
                          if (err)  { 
                                  return console.log(err); 
                          }
                          let todo = res.body;
                         console.log(todo);
                         sessionId=todo.Details;
                          });
                  
                  let jwt_token= await authToken.encrypt({
                      mobile_number:signin_data.mobile_number,
                      sessionId:sessionId,
                      otpId:otpId,
                      
                  });
                  let token= crypto.encrypt(jwt_token)

                  return token;

          } else {
              throw new CustomError('Invalid mobile number', 400, 'signin');
    
          }
      }catch(error){
            console.log('Sign_in',error);
            return new CustomError({error_message:error.message, error_statusCode:error.statusCode, meesage:'merchant does not exist'}); 
        }
    }

    //VerifyOTP

    async merchant_verifyOTP(otp_data){
        try{
            console.log(otp_data);
            otp_data= this.validateModelSchema(otp_data, datavalidator.merchant_otpverify());
            let decrypted_token= await crypto.decrypt(otp_data.otp_token);
            let authData= await authToken.verifyToken(decrypted_token);
            if(authData){
                let result=await this.db.collection(collections.merchant_data_detail).findOne({
                    mobile_number:authData.data.mobile_number,
                    })
                let userdata;
                const order_list_collection = this.db.collection(collections.merchant_data_detail);
                if(otp_data.otp_number==authData.data.otpId){
                userdata = await order_list_collection.findOne({ mobile_number: parseInt(authData.data.mobile_number) },
                {
                    
                        projection: {
                            "merchant_frysto_id": 1,
                            
                        }

                     } );
                console.log(userdata.merchant_frysto_id)
                    return (userdata.merchant_frysto_id);

                }else{
                    return 'wrong otp';
                }

            }

        } catch (error) {
            console.log('otp ', error);
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async add_merchant_detail(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, datavalidator.merchant_data_detail_validator());
            let current_date = moment().utc().toDate();
            let merchant_data_collection = this.db.collection(collections.merchant_data_detail);
            const order_id = await this.getNextUserIdValue();
            let merchant_data = await merchant_data_collection.findOne({$or:[{
                email:validatedData.email,
                mobile_number:validatedData.mobile_number,
                
            }]});

            if (merchant_data) {
                throw new CustomError('merchant_data_already  exist', 400, 'details');
            }

            const merchant_frysto_id = await this.getNextUserIdValue();
            
            const payload = {
                merchant_frysto_id:merchant_frysto_id,
                merchant_name: validatedData.merchant_name,
                email:validatedData.email,
                shop_name:validatedData.shop_name,
                mobile_number:validatedData.mobile_number,
                account_number:validatedData.account_number,
                bank_name:validatedData.bank_name,
                ifsc_code:validatedData.ifsc_code,
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
            console.log(merchant_frysto_id);
            console.log('merchant_id');

            const payload_merchant_detail = {

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
        const order_list_collection = this.db.collection(collections.users);
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





