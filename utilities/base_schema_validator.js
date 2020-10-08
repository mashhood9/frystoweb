const Joi = require('@hapi/joi');
class BaseSchemaValidator {
    validateSchema(payload, schema) {
        if (Array.isArray(payload) === true)
            schema = Joi.array().items(schema);

        const result = Joi.validate(payload, schema, {abortEarly : false, stripUnknown: true});
        if (result.error === null)
            return result.value;

        throw new CustomError(result.error, 400);
    }
}

module.exports = BaseSchemaValidator;