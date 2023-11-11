const httpStatusCodes = require("./httpStatusCodes");
const BaseError = require("./baseError");

class Http422Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCodes.UNPROCESSABLE_ENTITY,
    description = "Unprocessable Entity",
    isOperational = true
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Http422Error;
