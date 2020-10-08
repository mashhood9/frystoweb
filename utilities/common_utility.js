'use strict';
let mongoClient = require('../db/mongo_connection');
const config = require('../db/config').mongo_config;
const collections = config.collections;

class CommonUtility {
    constructor() { 
        this.db = mongoClient.getDb().db(config.database);
    }  

    async getNextUserIdValue(collection_name, key) {        
        let collection = this.db.collection(collection_name);
        let sequenceDocument = await collection.findOneAndUpdate(
            { _id: key },
            { $inc: { "sequence_value": 1 } },
            { new: true, returnOriginal: false, }
        );

        return sequenceDocument.value.sequence_value;
    }

    // Get Distinct Array values
    getDistinctArray(array, is_array_of_objects, key){
        /*
            `Set` is a new data object introduced in ES6. `Set` only lets you store unique values. When you pass in an array, it will remove any duplicate values.

            if 
                is_array_of_objects = true then it indicates we need distinct values based on specific key in array of object
            else
                Directly we will  get distinct values from array
        */
        if(is_array_of_objects){
            return [...new Set(array.map(item => item[key]))];
        }
        return [...new Set(array)];
    }
}

module.exports = CommonUtility;