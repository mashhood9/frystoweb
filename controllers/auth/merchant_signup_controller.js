const uuid = require('uuid/v4');
const request = require("request");
const moment = require('moment');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoClient = require('../../db/mongo_connection');
const log_collections = require('../../db/config').mongo_config.log_collections;
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const BaseModel = require('../../utilities/base_model');
let crypto = require('../../utilities/crypto');
let authToken = require('../../utilities/jwt.auth');
const signupValidator = require('../../models/merchant_signup_credential');
const SendOTP = require('../../utilities/send_otp')
;

class Merchant_Signup {
    constructor() {
        this.db = mongoClient.getDb().db();
    }

    // Create user
    /* 
        is_user_deleted flag is used for user deletion
        is_email_verified flag is used for email verification
        status  is used for user status

        In Status,
            1 indicates Approved
            2 indicates Blocked
            3 indicates Pending Admin Approval
            4 indicates Rejected
            5 indicates Pending Email Verification (Email not verified)
    */
    async createUser(merchant_signup_data) {
        try {
            let joi_validator = new BaseModel();
            let merchant_user_signup_data = joi_validator.validateModelSchema(merchant_signup_data, signupValidator.merchant_signup());
           
            let current_date = moment().utc().toDate();
            // Check user
            let merchant_user_collection = this.db.collection(collections.merchant_user);
            let user_data = await merchant_user_collection.findOne({$or:[{
                mobile_number : merchant_user_signup_data.mobile_number
            },
            {
                email : merchant_user_signup_data.email
            }]});

            if (user_data) {
                throw new CustomError('User already exists', 400, 'Signup');
            }

            // otp creation
            let mobile_otp = Math.floor(100000 + Math.random() * 900000);

            let is_mobile_verified = false;
            let merchant_frysto_id = await this.getNextUserIdValue();
            let encrypted_password = bcrypt.hashSync(merchant_user_signup_data.password, saltRounds);

            const payload = {
                merchant_frysto_id: merchant_frysto_id,
                email: merchant_user_signup_data.email.toString().toLowerCase(),
                mobile_number: merchant_user_signup_data.mobile_number,
                mobile_otp: mobile_otp,
                signup_registration_date: current_date,
                is_mobile_verified: is_mobile_verified,
                is_deleted: false,
                
                first_name: merchant_user_signup_data.first_name,
                last_name: merchant_user_signup_data.last_name,
                password: encrypted_password
            }
          //  const otp_result = await  sendOtp.sendOtp(user_signup_data.mobile_number, mobile_otp);//
            let inserted_user_data = await merchant_user_collection.insertOne(payload);
            // if(user_role === 2) {
                
            //     await user_collection.insertOne(payload);
            // }
           // if(inserted_user_data && otp_result) {
               // return otp_result;
           // }
            
            // await this.sendVerificationEmail(email_verification_token.token, user_signup_data.email);
            return merchant_frysto_id;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getNextUserIdValue() {
        let collection = this.db.collection(collections.user_counters);
        let sequenceDocument = await collection.findOneAndUpdate(
            { _id: "user_id" },
            { $inc: { "sequence_value": 1 } },
            { new: true, returnOriginal: false, }
        );
        console.log(sequenceDocument)
        return sequenceDocument.value.sequence_value;
    }


    async getUser(email) {
        return await this.db.collection(collections.user).findOne({ email })
    }

    async generateAuthToken(email) {
        const user_details = await this.getUser(email)
        let jwt_token = await authToken.encrypt({
            user_id: user_details.user_id,
            email: email,
            user_role: user_details.user_role
        });
        return crypto.encrypt(jwt_token);
    }

    async sendOtp(number, text) {
        var params = {
            Message: text,
            PhoneNumber: '+' + number,
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': 'Frysto OTP'
                }
            }
        };
    
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    
        publishTextPromise.then(
            function (data) {
                res.end(JSON.stringify({ MessageID: data.MessageId }));
            }).catch(
                function (err) {
                    res.end(JSON.stringify({ Error: err }));
                });
    }

    async getOTP(data) {
        try {
            const result = await this.db.collection(collections.user).findOne({ mobile_number: parseInt(data.mobile_number)}, {mobile_otp: 1, _id: -1});
            return result;
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = Merchant_Signup;

