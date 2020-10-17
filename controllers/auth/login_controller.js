const bcrypt = require('bcrypt');
const moment = require('moment');
let mongoClient = require('../../db/mongo_connection');
let authToken = require('../../utilities/jwt.auth');
let crypto = require('../../utilities/crypto');
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
const validatorSchema = require('../../models/credentials_schema');

class Login extends BaseModel{
    constructor() {
        super()
        this.db = mongoClient.getDb().db(config.database);
    }

async signin(user_credentials) {
        try {
            // const last_login_time = moment().utc().format('DD-MM-YYYY HH:mm:ss');
            let signin_data = await this.validateModelSchema(user_credentials, validatorSchema.signin());
            const last_login_time = moment().utc().toDate();
            const last_login_type = 'normal';
            let collection = this.db.collection(collections.user);
            let result = await collection.findOne({
                mobile_number: signin_data.mobile_number,
                is_deleted : false
            }, {
                    projection: {
                        "user_id": 1,
                        "password": 1,
                        "is_mobile_verified": 1,
                        "user_role" : 1,
                        "first_name":1
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
                var mobile_num= signin_data.mobile_number,
                url = baseurl.concat(mobile_num.toString(),'/',otpId,'/','OTP')
                



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
        } catch (error) {
            console.log('Signin: ', error);
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    // VerifyOTP
    async veryfyOTP(otp_data){
        try{
            console.log(otp_data);
            otp_data= this.validateModelSchema(otp_data, validatorSchema.otpverify());
            let decrypted_token= await crypto.decrypt(otp_data.otp_token);
            let authData= await authToken.verifyToken(decrypted_token);
            if(authData){
                let result=await this.db.collection(collections.user).findOne({
                    mobile_number:authData.data.mobile_number,
                    is_deleted:false,
                    })
                let userdata;
                const order_list_collection = this.db.collection(collections.user);
                if(otp_data.otp_number==authData.data.otpId){
                userdata = await order_list_collection.find({ mobile_number: parseInt(authData.data.mobile_number) }).toArray();
                    return userdata;

                }else{
                    return 'wrong otp';
                }

            }

        } catch (error) {
            console.log('otp ', error);
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    // Verify token
    async verifyToken(user_verification_data) {
        try {
            user_verification_data.token = this.validateModelSchema(user_verification_data.token, validatorSchema.verify_token());
            let decrypted_token = await crypto.decrypt(user_verification_data.token);
            let authData = await authToken.verifyToken(decrypted_token);
            if (authData) {
                let result = await this.db.collection(collections.user).findOne({
                    user_id: authData.data.user_id,
                    is_deleted: false,
                    is_email_verified : true
                }, {
                        projection: {
                            "user_id": 1
                        }
                    });
                if (result) {
                    return true;
                }
                else {
                    throw new CustomError('Unauthorized user', 401, 'signin');
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Verify Mobile Number
    async verifyMobileNumber(body) {
        try { 
            // Get email token
            let user_collection = this.db.collection(collections.user);
            let mobile_verification_data = await user_collection.findOne({
                mobile_otp : body.mobile_otp
            },{
                _id: 1,
                mobile_otp : 1
            });

            if(!mobile_verification_data){
                throw new CustomError('Invalid Details', 400, 'verify mobile');
            }
            // verify token validity
            // const current_timestamp = new Date().getTime();
            // const token_validity = mobile_verification_data.email_verification_token.valid_till;

            // if (current_timestamp > token_validity) {
            //     return false;
            // }

            let result = await this.db.collection(collections.user).updateOne({
                mobile_otp: body.mobile_otp
            }, {
                    $unset: {
                        mobile_otp: ""
                    },
                    $set: {
                        is_mobile_verified: true
                    }
                });
            if (result.matchedCount) {
                return true;
            }
            else {
                throw new CustomError('Unauthorized user', 401, 'verifyMobileNumber');
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async storeLoginDetails(login_history_obj) {
        try{
            if (login_history_obj.token) {
                delete login_history_obj.token;
            };
    
            let login_history_collection = this.db.collection(collections.login_history);
            let data = await login_history_collection.insertOne(login_history_obj);
            console.log(data);
        } catch(error){
            throw error;
        }        
    }

    // Check Duplicate Mobile Number
    async checkDuplicateMobileNubmer(email_data){
        try{
            // Validate data
            let validatedData = await this.validateModelSchema(email_data, validatorSchema.check_duplicate_email());
            
            let user_collection = this.db.collection(collections.user);
            let user_data = await user_collection.findOne({
                mobile_number: validatedData.mobile_number
            });

            let is_duplicate_mobile = false;

            if (user_data) {
                is_duplicate_mobile = true;
            };
            
            return { is_duplicate : is_duplicate_mobile };
        } catch(error){
            console.log('Signin: ', error);
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
}

module.exports = Login;




