const mongoClient = require('../../db/mongo_connection');
const config = require('../../db/config').mongo_config;
const collections = config.collections;
const moment = require('moment');
const BaseModel = require('../../utilities/base_model');
const userReportsFilterSchema = require('../../models/admin/user_report_schema').filters;
const FileUploader = require('../../utilities/file_uploader');

class AdminUserController {
    constructor(filter = {}, payload) {
        this.filters = filter;
        this.payload = payload;
        this.db = mongoClient.getDb().db();
    }

    checkIfUserIsAdmin() {
        return true;
    }
    async getUsersReport() {
        try {
            let $push;
            let $cond = [];
            let $and = [];
            let matched_filters = {};
            let joi_schema_validator = new BaseModel();
            let updated_filter = {};
            let start = new Date();
            start.setHours(0, 0, 0, 0); // set to 12:00 am today
            let end = new Date();
            end.setHours(23, 59, 59, 999); // set to 23:59 pm today

            // Filter
            let available_filters = [{
                search_key: "new_user",
                filter_key : "$new_users_count"
            },{
                search_key: "status",
                filter_key : "$is_email_verified"
            }];

            if(Object.keys(this.filters).length){
                matched_filters = joi_schema_validator.validateModelSchema(this.filters, userReportsFilterSchema());
            };

            let user_projection = {
                "user_id": "$user_id",
                "user_role": "$user_role",
                "first_name": "$first_name",
                "email": "$email",
                "last_name": "$last_name",
                "avatar": "$avatar",
                "phone_number": "$phone_number",
                "registration_date": "$registration_date",
                "country": "$country",
                "is_email_verified": "$is_email_verified",
                "is_new_user": "$new_users_count"
            };
            let filter_key_length = Object.keys(matched_filters).length;

            if(filter_key_length){
                let i=0;
                for(let key in matched_filters){
                    updated_filter = available_filters.find((elem) => { return elem.search_key == key});

                    if(updated_filter){
                        if(filter_key_length > 1){
                            $and.push({ $eq: [updated_filter.filter_key, matched_filters[key]]});
                            i++;

                            if(i == filter_key_length){
                                $cond.push({ $and: $and}, user_projection, null)
                                $push = {
                                    $cond: $cond
                                };
                            };
                        }
                        else{
                            $cond.push({ $eq: [updated_filter.filter_key, matched_filters[key]]}, user_projection, null);
                            $push = {
                                $cond: $cond
                            };
                        };
                    };
                };                
            }
            else{
                $push = user_projection;
            };               

            if (this.checkIfUserIsAdmin()) {
                let collection = this.db.collection(collections.user);
                let users_data = await collection.aggregate([{
                    $match: {
                        "is_deleted": false
                    }
                }, {
                    $lookup: {
                        from: collections.country_master,
                        localField: "user_profile.general_details.country",
                        foreignField: "id",
                        as: "country"
                    }
                }, {
                    $unwind: {
                        path: "$country",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        _id: 0,
                        "user_id": 1,
                        "user_role": 1,
                        "first_name": "$user_profile.general_details.first_name",
                        "email": "$email",
                        "last_name": "$user_profile.general_details.last_name",
                        "avatar": "$user_profile.general_details.avatar",
                        "phone_number": "$user_profile.contact_details.mobile_number",
                        "registration_date": "$signup_registration_date",
                        "is_email_verified": "$is_email_verified",
                        "country": {
                            $ifNull: ["$country.nicename", null]
                        },
                        "pending_email_count": {
                            "$cond": [{ "$eq": ["$is_email_verified", false] }, 1, 0]
                        },
                        "approved_count": {
                            "$cond": [{ "$eq": ["$is_email_verified", true] }, 1, 0]
                        },
                        "new_users_count": {
                            "$cond": [
                                {
                                    "$and": [{ "$gte": ["$signup_registration_date", start] },
                                    { "$lt": ["$signup_registration_date", end] }]
                                }, 1, 0]
                        }
                    }
                },  {
                    $group: {
                        "_id": "1",
                        "total_approved": {
                            "$sum": "$approved_count"
                        },
                        "total_pending_email": {
                            "$sum": "$pending_email_count"
                        },
                        "total_new_users": {
                            "$sum": "$new_users_count"
                        },
                        "total_count": {
                            "$sum": 1
                        },
                        "user_report_data": { $push }
                    }
                }]).toArray();
                users_data = users_data.length ? users_data[users_data.length - 1] : null;
                if (users_data)
                    return {
                        ...users_data,
                        user_report_data: (users_data.user_report_data.filter(item => item != null))
                    }

                return null;
            }
            throw new Error("Not Authorized");

        } catch (error) {
            throw new CustomError(error.message, error.statusCode, 'getUsersReport');
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
     //Add master list
     async addMasterList(data){
        try{
            const category_type_collection = this.db.collection(collections.category_type);
            const findCategory = await category_type_collection.findOne({
                category_id : data.category_id
            });
            console.log(">>>>>.findCategory.. ", findCategory);

            if (!findCategory) {
                throw new CustomError('Category not found, invalid category id', 400, 'addMasterList');
            }

            const master_list_collection = this.db.collection(collections.master_list);
            const findMasterList = await master_list_collection.findOne({
                product_name : data.product_name
            });
            if (findMasterList) {
                throw new CustomError('Product already exists', 400, 'addMasterList');
            }

            const master_id = await this.getNextUserIdValue();
            const payload = {
                master_id: master_id,
                category_id: data.category_id,
                product_name: data.product_name,
                product_description: data.product_description,
            };

            await master_list_collection.insertOne(payload);
            return master_id;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'addMasterList'); 
        }
    }
    // add product list
    
     //Get master lists
     async getMasterList(category_id){
        try{
            const master_list_collection = this.db.collection(collections.master_list);
            let masterList;
            if(category_id === 0){
                masterList = await master_list_collection.find({}).toArray();
            } else {
                masterList = await master_list_collection.find({ category_id: parseInt(category_id) }).toArray();
            }
            return masterList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }
      // get product-list according to merchant
    async getProductList(merchant_id){
        try{
            const product_list_collection = this.db.collection(collections.product_list);
            let productList;
            if(merchant_id === 0){
                productList = await product_list_collection.find({}).toArray();
            } else {
                productList = await product_list_collection.find({ merchant_id: parseInt(merchant_id) }).toArray();
            }
            return productList;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'getMasterList'); 
        }
    }

     //delete master list
     async deleteMasterList(master_id){
        try{
            const master_list_collection = this.db.collection(collections.master_list);
            const findMasterList = await master_list_collection.findOne({
                master_id : master_id
            });
            if (!findMasterList) {
                throw new CustomError('Master id not found in db', 400, 'deleteMasterList');
            }
            await master_list_collection.deleteOne({ master_id: master_id});
            return true;
        } catch(error){
            console.log(error);
            throw new CustomError(error.message, error.statusCode, 'deleteMasterList'); 
        }
    }


}

module.exports = AdminUserController;