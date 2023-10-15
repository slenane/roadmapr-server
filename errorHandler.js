const BaseError = require("./utils/errorHandling/baseError");

const logError = (err) => {
  console.error(err);
};

const logErrorMiddleware = (err, req, res, next) => {
  logError(err);
  next(err);
};

const returnError = (err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message);
};

const isOperationalError = (error) => {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
};

module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError,
};
