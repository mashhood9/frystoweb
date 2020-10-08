'use strict';
class BaseMongoQueryGenerator {
    constructor() {

    }
    generateUpdateObjectQuery(data, obj_ref) {
        let queryObj = {
            setQuery: {}
        };
        if(Array.isArray(data) === true){
            queryObj.setQuery[obj_ref] = data;
            return queryObj;
        }
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                const objKey = `${obj_ref}.${key}`
                queryObj.setQuery[objKey] = element;
            }
        }
        return queryObj;
    }

    generateArrayUpdateQuery(data, obj_ref, field, db_obj) {
        let { updateObj, addToSetObj } = this._getAddUpdateArray(db_obj, data, field)
        let updateQuery = this._getUpdateArrayQuery(updateObj, obj_ref, field);
        let addToSet = this._getAddToSet(addToSetObj, obj_ref);
        return {
            setQuery: updateQuery.setQuery,
            arrayFilter: updateQuery.arrayFilter,
            addToSet: addToSet
        }
    }
    _getUpdateArrayQuery(data, obj_ref, field) {
        let updateObj = {
            setQuery: {},
            arrayFilter: []
        };
        data.map((item) => {
            if(!item[field]){
                throw new Error(`Failed to generate update array query due to key field [${field}] undefined. Please verify the arguments`);
            }
            let ref = item[field].replace('_', '')
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const value = item[key];
                    const objKey = `${obj_ref}.$[${ref}].${key}`
                    updateObj.setQuery[objKey] = value;
                }
            }
            let refKey = `${ref}.${field}`,
                refVal = item[field];
            let arrfilterObj = {}
            arrfilterObj[refKey] = refVal;
            updateObj.arrayFilter.push(arrfilterObj);
        });
        return updateObj;
    }

    _getAddToSet(data, field) {
        let addToSetObj = {}
        addToSetObj[field] = {
            $each: data
        }
        return addToSetObj;
    }

    _getAddUpdateArray(db_obj, obj, key) {
        if (!Array.isArray(obj)) {
            throw new Error(`Failed to generate update array query. Please verify the arguments`);
        }
        let result = {
            updateObj: [],
            addToSetObj: []
        };
        obj.forEach((item) => {
            let matched = db_obj.filter(db_item => {
                if (db_item[key] === item[key]) {
                    return db_item;
                }
            });
            if (matched.length > 0) {
                result.updateObj.push(item);
            } else {
                result.addToSetObj.push(item);
            }
        });
        return result;
    }
}

module.exports = BaseMongoQueryGenerator;