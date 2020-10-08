const uuid = require('uuid/v4');
const moment = require('moment');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoClient = require('../../db/mongo_connection');
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
const validatorSchema = require('../../models/credentials_schema');
const SendOTP = require('../../utilities/send_otp');

class ResetPwd extends BaseModel {
    constructor(body) {
        super();
        this.payload = body;
        this.db = mongoClient.getDb().db();
    }
    // Verify reset pwd token
    async verifyResetPwdToken(token_obj) {
        try {
            // token_obj.reset_password_token = this.validateModelSchema(token_obj.reset_password_token, validatorSchema.verify_token());
            if (parseInt(token_obj.reset_password_token)) {
                let collection = await this.db.collection(collections.user);
                let result = await collection.findOne(
                    { 
                        "reset_password_token.token": token_obj.reset_password_token
                    },
                    {
                        projection: {
                            "user_id": 1,
                            "reset_password_token": 1
                        }
                    });
                
                // check validity of token
                if (result) {
                    return true;
                    // const current_timestamp = new Date().getTime();
                    // if (current_timestamp <= result.reset_password_token.valid_till) {
                    //     return true;
                    // } else {
                    //     return false;
                    // }
                }
                else {
                    throw new CustomError('Invalid Token', 400, 'verifyResetPwdToken');
                }
            }
            else {
                throw new CustomError('Invalid Token', 400, 'verifyResetPwdToken');
            }
        } catch (error) {
            console.log(error);
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    // Reset Pwd 
    async resetPwd(user_obj) {
        try {
            user_obj = this.validateModelSchema(user_obj, validatorSchema.reset_password());
            let collection = await this.db.collection(collections.user);
            // We need to check token against an email
            let result = await collection.findOne(
                { 
                    mobile_number: user_obj.mobile_number,
                    is_mobile_verified: true,
                    is_deleted : false,
                    'reset_password_token.token': user_obj.reset_password_token
                }
            );
            if (result) {
                // check expiry date of token
                if (new Date().getTime() > result.reset_password_token.valid_till) {
                    return false;
                }
                // Hash password and save
                let encrypted_password = bcrypt.hashSync(user_obj.password, saltRounds);
                await collection.updateOne(
                    {
                        mobile_number: user_obj.mobile_number,
                        "reset_password_token.token": user_obj.reset_password_token
                    },
                    {
                        $set: {
                            password: encrypted_password
                        },
                        $unset: {
                            reset_password_token: ""
                        }
                    });
                return true;
            }
            else {
                throw new CustomError('Invalid Token', 400, 'resetPwd');
            }
        } catch (error) {
            console.log(error);
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    // Forgot password
    async forgotPwd(user_obj) {
        try {
            user_obj = this.validateModelSchema(user_obj, validatorSchema.forgot_password());
            let collection = await this.db.collection(collections.user);
            let result = await collection.findOne({ 
                mobile_number: user_obj.mobile_number, 
                is_mobile_verified : true,
                is_deleted: false 
            });

            if (result) {
                await this.generateResetPwdToken(result);
            }
            else {
                throw new CustomError('User not found', 404, 'forgotPwd');
            }
            return result;
        } catch (error) {
            console.log(error);
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
    // Function for generating reset pwd token
    async generateResetPwdToken(result) {
        try {
            const sendOTP = new SendOTP();
            let collection = await this.db.collection(collections.user);
            // Generate new password link
            // let reset_password_token = uuid();
            let mobile_otp = Math.floor(100000 + Math.random() * 900000);
            const timestamp = moment().add(1, 'd').toDate().getTime();
            await collection.updateOne({
                mobile_number: result.mobile_number,
                is_mobile_verified: true,
                is_deleted: false
            }, {
                $set: {
                    reset_password_token: {
                        token:  mobile_otp,
                        // valid_till: timestamp
                    }
                }
            });
            
            // Generate url and send email
            // const url = `${process.env.DOMAIN_NAME}auth/reset-pwd/${reset_password_token}`;
            // const template = `Hello <b>${result.mobile_number}</b>,
            //               <br>
            //               Click on this <a href="${url}" target="_blank">link</a> to reset your password.`;
            // const subject = 'Reset Password';
            // await sendOTP.sendOtp(result.mobile_number, template)
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getForgotToken(data) {
        try {
            const result = await this.db.collection(collections.user).findOne({ mobile_number: parseInt(data.mobile_number)});
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    

    

   
}
module.exports = ResetPwd;


