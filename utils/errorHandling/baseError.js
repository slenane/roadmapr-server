class BaseError extends Error {
  constructor(message, statusCode, isOperational, description) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
