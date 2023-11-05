const { body, validationResult } = require("express-validator");
const ALERTS = require("../utils/alerts");
const Http422Error = require("../utils/errorHandling/http422Error");

const getRegistrationRules = () => {
  return [
    body("username", ALERTS.AUTH.ERROR.USERNAME_INVALID)
      .isLength({ min: 2 })
      .trim()
      .escape(),
    body("email", ALERTS.AUTH.ERROR.EMAIL_INVALID)
      .exists()
      .isEmail()
      .normalizeEmail(),
    body("password", ALERTS.AUTH.ERROR.PASSWORD_INVALID)
      .isLength({ min: 6, max: 20 })
      .trim()
      .escape(),
  ];
};

const getLoginRules = () => {
  return [
    body("email", ALERTS.AUTH.ERROR.EMAIL_INVALID)
      .exists()
      .isEmail()
      .normalizeEmail(),
    body("password", ALERTS.AUTH.ERROR.PASSWORD_INVALID)
      .isLength({ min: 6, max: 20 })
      .trim()
      .escape(),
  ];
};

const getResetPasswordRules = () => {
  return [
    body("password", ALERTS.AUTH.ERROR.PASSWORD_INVALID)
      .isLength({ min: 6, max: 20 })
      .trim()
      .escape(),
  ];
};

const sanitize = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const firstError = errors.array()[0].msg;
    throw new Http422Error(firstError);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRegistrationRules,
  getLoginRules,
  getResetPasswordRules,
  sanitize,
};
