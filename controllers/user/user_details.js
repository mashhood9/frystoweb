'use strict';
const BaseModel = require('../../utilities/base_model');
const Long = require('mongodb').Long;
const  UserDetailsSchema = require('../../models/user_details_schema');
const BaseMongoQueryGenerator = require('../../utilities/base_mongo_query_generator');

class UserDetails extends BaseModel {
    constructor() {
        super();
        this.queryObj = {
            setQuery: {},
            arrayFilter: []
        };
        this.queryGenerator = new BaseMongoQueryGenerator();
    }

    _updateGeneralDetails(general_details_obj) {
        try {
            const general_details = this.validateModelSchema(general_details_obj, UserDetailsSchema.general_details());
            const query = this.queryGenerator.generateUpdateObjectQuery(general_details, 'user_profile.general_details');
            return query;
          } catch (error) {
            throw error;
          }

    }

    _updatepersonalDetails(user_personal_details) {
        if (user_personal_details) {
            if(user_personal_details.personal_information){
                this._updatePersonalInformation(user_personal_details.personal_information);
            }

            if(user_personal_details.residential_information){
                this._updateResidentialInformation(user_personal_details.residential_information);
            }
            
            if(user_personal_details.contact_information){
                this._updateContactInformation(user_personal_details.contact_information);
            }
            
        }
        return this.queryObj;
    }
    _updatePersonalInformation(personal_information_obj) {
        try {
            const personal_information = this.validateModelSchema(personal_information_obj, UserDetailsSchema.user_personal_details.personal_information());
            const query = this.queryGenerator.generateUpdateObjectQuery(personal_information, 'user_personal_details.personal_information');
            Object.assign(this.queryObj.setQuery, query.setQuery);
        } catch (error) {
            throw error;
        }
    }

    _updateResidentialInformation(residential_information_obj) {
        try {
            const residential_information = this.validateModelSchema(residential_information_obj, UserDetailsSchema.user_personal_details.residential_information());
            const query = this.queryGenerator.generateUpdateObjectQuery(residential_information, 'user_personal_details.residential_information');
            Object.assign(this.queryObj.setQuery, query.setQuery);
        } catch (error) {
            throw error;
        }
    }

    _updateContactInformation(contact_information_obj) {
        try {
            const contact_information = this.validateModelSchema(contact_information_obj, UserDetailsSchema.user_personal_details.contact_information());

            if(contact_information.mobile_number){
                contact_information.mobile_number = Long.fromNumber(contact_information.mobile_number);
            };
            
            const query = this.queryGenerator.generateUpdateObjectQuery(contact_information, 'user_personal_details.contact_information');
            Object.assign(this.queryObj.setQuery, query.setQuery);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserDetails;