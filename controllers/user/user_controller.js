const mongoClient = require('../../db/mongo_connection');
const log_collections = require('../../db/config').mongo_config.log_collections;
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const validatorSchema = require('../../models/user_schema');
const UserPersonalDetails = require('./user_details');
const BaseModel = require('../../utilities/base_model');
const FileUploader = require('../../utilities/file_uploader');
const validator = require('../../models/credentials_schema');
const categoryValidator = require('../../models/category_schema');


class User extends BaseModel {
    constructor() {
        super();
        this.db = mongoClient.getDb().db();
    }

    async getUserData(user_data) {
        const filter = { user_id : user_data.user_id,
            is_deleted : false,
            is_email_verified : true
        };
        try {
            let user_collection = this.db.collection(collections.user);
            let response  = await user_collection.findOne(filter);                       
            WinstonLogger.info({ log_type: 'User Data', message: {data: response.length}, collection_name: log_collections.admin_logs });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateUserDetails(user_data) {
        try {
            let validatedData = await this.validateModelSchema({ user_id : user_data.user_id }, validatorSchema.userDetailUpdate());
            if (Object.keys(validatedData).length) {
                const filter = {
                    user_id: validatedData.user_id,
                    is_deleted: false,
                    is_mobile_verified: true };
                let user_collection = this.db.collection(collections.user);
                let userDetailsDb = await user_collection.findOne(filter);
                console.log("userDetailsDb data", userDetailsDb);
                if (userDetailsDb) {
                    const payload = {};
                    if(user_data.first_name) payload.first_name = user_data.first_name;
                    if(user_data.last_name) payload.last_name = user_data.last_name;
                    if(Object.keys(payload).length){
                        await user_collection.updateOne(filter, { $set: payload });
                        return await user_collection.findOne(filter);
                    }
                    return userDetailsDb;
                } else {
                    throw new CustomError('Falied to Update User Details', 400, 'updateUserPersonalDetails');
                }
                
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    generateUpdatedObject(user_details) {
        let currentDate = new Date();
        let $set = {updated_on : currentDate, updated_by : user_details.user_id};
        // if (user_details.email) {
        //    $set['email'] = user_details.email;
        // }
        if (user_details.user_profile) {
            if (user_details.user_profile.general_details) {
                const userPersonalDetails = new UserPersonalDetails();
                let updatedGenaralDetails = userPersonalDetails._updateGeneralDetails(user_details.user_profile.general_details);
                Object.assign($set, updatedGenaralDetails.setQuery);
                // arrayFilter = arrayFilter.concat(userProfile.arrayFilter);
            }
        }
        if (user_details.user_personal_details) {
            if (user_details.user_personal_details.personal_information) {
                const userPersonalDetails = new UserPersonalDetails();
                let updatedPersonalDetails = userPersonalDetails._updatepersonalDetails(user_details.user_personal_details);
                Object.assign($set, updatedPersonalDetails.setQuery);
                // arrayFilter = arrayFilter.concat(userProfile.arrayFilter);
            }
        }
        return $set;
    }

    async updateProfilePic(request_body, file_data){
        try{
            let fileUploader = new FileUploader();
            let user_collection = this.db.collection(collections.user);
            const pathToDir = global.appRootDirectory + `/content/${request_body.user_id}/images`;
            let profile_pic = file_data.profile_pic;
            let [fileObj, userProfileData] = await Promise.all([
                await fileUploader.uploadFile(pathToDir,profile_pic),
                await user_collection.findOne({
                    user_id : request_body.user_id,
                    is_deleted : false,
                    is_email_verified : true 
                })
            ]);
            
            if(!userProfileData){
                throw new CustomError('User Not Found', 404, 'updateProfilePic');
            }

            if(userProfileData.user_profile && userProfileData.user_profile.general_details && userProfileData.user_profile.general_details.avatar){
                let image_path = userProfileData.user_profile.general_details.avatar.split('/');
                fileUploader.removeImages(`/content/${request_body.user_id}/images/${image_path[image_path.length-1]}`);
            }
    
            let data = await user_collection.updateOne({
                user_id : request_body.user_id,
                is_deleted : false,
                is_email_verified : true 
            },{
                $set : {
                    "user_profile.general_details.avatar" : `profile-pic/${userProfileData.user_profile.general_details.profile_pic_token}/${fileObj[0]}`
                }
            });
    
            return true;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'updateProfilePic'); 
        }
        
    }

    // Get profile pic
    async getUserProfilePic(profile_pic_data){        
        try {
            let validatedProfilePicData = this.validateModelSchema(profile_pic_data,validatorSchema.userProfilePic());
            let user_collection = this.db.collection(collections.user);
            let user_profile_data  = await user_collection.findOne({
                is_deleted : false,
                is_email_verified : true,
                "user_profile.general_details.profile_pic_token" : validatedProfilePicData.token
            });    
            let response = {
                success : false
            };
            
            if(user_profile_data) {
                response = {
                    success : true,
                    image_path : `content/${user_profile_data.user_id}/images/${validatedProfilePicData.image}`
                }
            }
            
            WinstonLogger.info({ log_type: 'UserProfile Data', message: {data: profile_pic_data}, collection_name: log_collections.admin_logs });
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async addAddress(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, validator.address());
           
            let address_collection = this.db.collection(collections.address);
            let findAddress = await address_collection.findOne({
                user_id : validatedData.user_id
            });

            if (findAddress) {
                throw new CustomError('Address already exists', 400, 'addAddress');
            }
            const address_id = await this.getNextUserIdValue();
            const payload = {
                address_id: address_id,
                user_id: validatedData.user_id,
                address_1: validatedData.address_1,
                address_2: validatedData.address_2,
                city: validatedData.city,
                post_code: validatedData.post_code
            };

            await address_collection.insertOne(payload);
            return user_id;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'addAddress'); 
        }
    }

    async updateAddress(data){
        try{
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, validator.address());
           
            const address_collection = this.db.collection(collections.address);
          
            const payload = {
                address_1: validatedData.address_1,
                address_2: validatedData.address_2,
                city: validatedData.city,
                post_code: validatedData.post_code
            };

            await address_collection.updateOne({ user_id: validatedData.user_id }, {$set: payload});
            const res = await address_collection.findOne({ user_id: validatedData.user_id });
            return res;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'updateAddress'); 
        }
    }

    async getAddressByUserId(user_id){
        try{
            const address_collection = this.db.collection(collections.address);
            const findAddress = await address_collection.findOne({user_id: user_id});
            return findAddress;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getAddressByUserId'); 
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

    //Add Category type
    async addCategory(data){
        try{
            
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, categoryValidator.categoryAddSchema());
           
            const category_type_collection = this.db.collection(collections.category_type);
            const findCategory = await category_type_collection.findOne({
                category_name : validatedData.category_name
            });
            if (findCategory) {
                throw new CustomError('Category already exists', 400, 'addCategory');
            }
            const category_id = await this.getNextUserIdValue();
            const payload = {
                category_id: category_id,
                category_name: validatedData.category_name,
                category_description: validatedData.category_description
            };

            await category_type_collection.insertOne(payload);
            return category_id;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'addCategory'); 
        }
    }

    //Update Category type
    async updateCategory(data){
        try{
            let joi_validator = new BaseModel();
            let validatedData = joi_validator.validateModelSchema(data, categoryValidator.categoryUpdateSchema());
           
            const category_type_collection = this.db.collection(collections.category_type);
            const findCategory = await category_type_collection.findOne({
                category_id : validatedData.category_id
            });
            if (!findCategory) {
                throw new CustomError('Invalid category id', 400, 'updateCategory');
            }
            const payload = { };
            if(validatedData.category_name){
                payload.category_name= validatedData.category_name;
            }
            if(validatedData.category_description){
                payload.category_description=validatedData.category_description;
            }
            if(Object.keys(payload).length){
                await category_type_collection.updateOne({ category_id: validatedData.category_id }, {$set: payload});
            }
            const res = await category_type_collection.findOne({ category_id: validatedData.category_id });
            return res;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'updateCategory'); 
        }
    }

    //Get category type lists
    async getCategory(){
        try{
            const category_type_collection = await this.db.collection(collections.category_type);
            const categoryList = await category_type_collection.find({}).toArray();
            return categoryList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getCategory'); 
        }
    }

     //delete category type
     async deleteCategory(category_id){
        try{
            const category_type_collection = this.db.collection(collections.category_type);
            const findCategory = await category_type_collection.findOne({
                category_id : category_id
            });
            if (!findCategory) {
                throw new CustomError('Category id not found in db', 400, 'deleteCategory');
            }
            await category_type_collection.deleteOne({ category_id: category_id});
            return true;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'deleteCategory'); 
        }
    }
}

module.exports = User;




