const httpStatusCodes = require("./httpStatusCodes");
const BaseError = require("./baseError");

class Http404Error extends BaseError {
  constructor(
    message,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Not Found",
    isOperational = true
  ) {
    super(message, statusCode, isOperational, description);
  }
}

module.exports = Http404Error;
