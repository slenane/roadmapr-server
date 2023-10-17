const httpStatusCodes = require("./httpStatusCodes");
const BaseError = require("./baseError");

class Http500Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCodes.INTERNAL_SERVER,
    description = "Internal Server Error",
    isOperational = true
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Http500Error;
