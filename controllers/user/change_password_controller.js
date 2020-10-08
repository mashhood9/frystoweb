let mongoClient = require('../../db/mongo_connection');
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const BaseModel = require('../../utilities/base_model');
const validatorSchema = require('../../models/credentials_schema');

class ChangePassword extends BaseModel{
    constructor() {
        super();
        this.db = mongoClient.getDb().db(config.database);
    }

    // Change Password By User
    async changePasswordByUser(user_obj) {
        try {
            let password_object = this.validateModelSchema(user_obj.password_obj, validatorSchema.change_password())
            let collection = await this.db.collection(collections.user);
            let result = await collection.findOne({
                user_id: user_obj.user_id,
                is_deleted : false,
                is_email_verified : true
            },
            {   
                projection: {
                    "user_id": 1, 
                    "user_profile.general_details.password":1
                }
            });

            if (result) {
                let match = await bcrypt.compare(password_object.old_password, result.user_profile.general_details.password);

                if(match){
                    if(password_object.old_password != password_object.new_password) {
                        return await this.updatePassword(user_obj.user_id, password_object.new_password);
                    }
                    else{
                        throw new CustomError('Old and New Password cannot be same', 400, 'changePasswordByUser');
                    }
                }
                else {
                    throw new CustomError('Incorrect Password', 400, 'changePasswordByUser');
                };
            }
            else {
                throw new CustomError('No User Found', 404, 'changePasswordByUser');
            };

        } catch (error) {
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'changePasswordByUser');
        }
    }    

    // Update password to new password
    async updatePassword(user_id, new_password) {
        try{
            let collection = await this.db.collection(collections.user);
            let encrypted_new_password = bcrypt.hashSync(new_password, saltRounds);
            await collection.updateOne({ 
                user_id: user_id 
            },
            {   
                $set: { 
                    'user_profile.general_details.password': encrypted_new_password 
                }
            });
            return true;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'updatePasswordDb');
        }
    }

    async verifyCurrentPassword(password_data){
        try{
            // Validate data
            let validatedData = await this.validateModelSchema(password_data.password_object, validatorSchema.verify_current_password()); 
            let user_collection = this.db.collection(collections.user);
            let result = await user_collection.findOne({
                user_id: password_data.user_id,
                is_deleted : false,
                is_email_verified : true
            },
            {   
                projection: {
                    "user_id": 1, 
                    "user_profile.general_details.password":1
                }
            });
            let is_current_password = false;
            if (result) {
                let match = await bcrypt.compare(validatedData.password, result.user_profile.general_details.password);
                if(match) {
                    is_current_password =  true;
                }
            }
            else {
                throw new CustomError('No User Found', 404, 'verifyCurrentPassword');
            };
            return { is_current_password : is_current_password };
        } catch(error){
            console.log('ChangePassword: ', error);
            throw new CustomError(error.message, error.statusCode, 'verifyCurrentPassword');
        }
    }

}

module.exports = ChangePassword;




