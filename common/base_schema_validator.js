const Joi = require('joi');

class BaseSchemaValidator {
  validateSchema(payload, schema) {
    this.schema = schema;
    if (Array.isArray(payload) === true) {
      this.schema = Joi.array().items(schema);
    }
    this.result = Joi.validate(payload, this.schema, {abortEarly: true, stripUnknown: true});
    if (this.result.error === null) {
      return this.result.value;
    }
    throw new Error(this.result.error);
  }
}

module.exports = BaseSchemaValidator;
