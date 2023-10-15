const httpStatusCodes = require("./httpStatusCodes");
const BaseError = require("./baseError");

class Http400Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = "Bad Request",
    isOperational = true
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Http400Error;
