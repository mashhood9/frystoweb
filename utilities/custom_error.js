class CustomError extends Error {

    constructor( message,  statusCode, functionName) {
      super(message);
      Error.captureStackTrace(this, CustomError);
      this.name = (this).constructor.name; // OR this.name = (<any>this).constructor.name;
      this.statusCode = statusCode;
      this.functionName = functionName
    }
  
  };

module.exports = CustomError;