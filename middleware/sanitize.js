const { body, validationResult } = require("express-validator");
const ALERTS = require("../utils/alerts");
const Http400Error = require("../utils/errorHandling/http400Error");

const rules = {
  username: body("username", ALERTS.AUTH.ERROR.USERNAME_INVALID)
    .isLength({ min: 2, max: 20 })
    .trim()
    .escape(),
  email: body("email", ALERTS.AUTH.ERROR.EMAIL_INVALID)
    .exists()
    .isEmail()
    .normalizeEmail(),
  password: body("password", ALERTS.AUTH.ERROR.PASSWORD_INVALID)
    .isLength({ min: 6, max: 20 })
    .trim()
    .escape(),
  education: [
    body("type").custom((value) => {
      if (value !== "book" && value !== "course") {
        throw new Error(ALERTS.EDUCATION.ERROR.TYPE_INVALID);
      }
      return true;
    }),
    body("title", ALERTS.EDUCATION.ERROR.TITLE_INVALID)
      .isLength({ min: 3 })
      .trim()
      .escape(),
    body("author", ALERTS.EDUCATION.ERROR.AUTHOR_INVALID)
      .isLength({ min: 3 })
      .trim()
      .escape(),
    body("stack").custom((value) => {
      if (body("type") === "course" && !value.length) {
        throw new Error(ALERTS.EDUCATION.ERROR.STACK_INVALID);
      }
      return true;
    }),
    body("link", ALERTS.EDUCATION.ERROR.LINK_INVALID)
      .matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
      .escape(),
  ],
};

const getRegistrationRules = () => {
  return [rules.email, rules.password];
};

const getLoginRules = () => {
  return [rules.email, rules.password];
};

const getResetPasswordRules = () => {
  return [rules.password];
};

const getEducationRules = () => {
  return [...rules.education];
};

const sanitize = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const firstError = errors.array()[0].msg;
    throw new Http400Error(firstError);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRegistrationRules,
  getLoginRules,
  getResetPasswordRules,
  getEducationRules,
  sanitize,
};
