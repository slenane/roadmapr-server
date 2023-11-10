const { body, validationResult } = require("express-validator");
const ALERTS = require("../utils/alerts");
const Http400Error = require("../utils/errorHandling/http400Error");

const validUrlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

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
  startDate: body("startDate", ALERTS.START_DATE_INVALID)
    .optional()
    .isDate()
    .escape(),
  endDate: body("endDate", ALERTS.END_DATE_INVALID)
    .optional()
    .isDate()
    .escape(),

  title: body("title", ALERTS.TITLE_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  author: body("author", ALERTS.EDUCATION.ERROR.AUTHOR_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  company: body("company", ALERTS.EMPLOYMENT.ERROR.COMPANY_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  role: body("role", ALERTS.EMPLOYMENT.ERROR.ROLE_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  stack: body("stack").custom((value) => {
    if (!value.length) {
      throw new Error(ALERTS.STACK_INVALID);
    }
    return true;
  }),
  locationId: body("location.*.id", ALERTS.PROFILE.ERROR.LOCATION_INVALID)
    .isLength({ min: 2, max: 2 })
    .trim()
    .escape(),
  locationName: body("location.*.name", ALERTS.PROFILE.ERROR.LOCATION_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  nationalityId: body(
    "nationality.*.id",
    ALERTS.PROFILE.ERROR.NATIONALITY_INVALID
  )
    .isLength({ min: 2 })
    .trim()
    .escape(),
  nationalityName: body(
    "nationality.*.name",
    ALERTS.PROFILE.ERROR.NATIONALITY_INVALID
  )
    .isLength({ min: 3 })
    .trim()
    .escape(),
  firstName: body("firstName", ALERTS.PROFILE.ERROR.FIRST_NAME_INVALID)
    .trim()
    .escape(),
  lastName: body("lastName", ALERTS.PROFILE.ERROR.LAST_NAME_INVALID)
    .trim()
    .escape(),
  pathId: body("path.*.id", ALERTS.PROFILE.ERROR.PATH_INVALID)
    .isLength({ min: 2 })
    .trim()
    .escape(),
  pathName: body("path.*.name", ALERTS.PROFILE.ERROR.PATH_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  cv: body("links.*.cv", ALERTS.LINK_INVALID)
    .optional()
    .matches(validUrlRegex)
    .escape(),
  linkedIn: body("links.*.linkedIn", ALERTS.LINK_INVALID)
    .optional()
    .matches(validUrlRegex)
    .escape(),
  portfolio: body("links.*.portfolio", ALERTS.LINK_INVALID)
    .optional()
    .matches(validUrlRegex)
    .escape(),
  twitter: body("links.*.twitter", ALERTS.LINK_INVALID)
    .optional()
    .matches(validUrlRegex)
    .escape(),
  project: body("project", ALERTS.LINK_INVALID)
    .optional()
    .matches(validUrlRegex)
    .escape(),
  companyLink: body("companyLink", ALERTS.LINK_INVALID)
    .optional()
    .matches(validUrlRegex)
    .escape(),
  link: body("link", ALERTS.LINK_INVALID).matches(validUrlRegex).escape(),
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
  return [
    body("type").custom((value) => {
      if (value !== "book" && value !== "course") {
        throw new Error(ALERTS.EDUCATION.ERROR.TYPE_INVALID);
      }
      return true;
    }),
    body("stack").custom((value) => {
      if (body("type") === "course" && !value.length) {
        throw new Error(ALERTS.EDUCATION.ERROR.STACK_INVALID);
      }
      return true;
    }),
    rules.title,
    rules.author,
    rules.startDate,
    rules.endDate,
    rules.link,
  ];
};

const getEmploymentRules = () => {
  return [
    body("type").custom((value) => {
      if (value !== "freelance" && value !== "employment") {
        throw new Error(ALERTS.EMPLOYMENT.ERROR.TYPE_INVALID);
      }
      return true;
    }),
    rules.role,
    rules.company,
    rules.companyLink,
    rules.project,
    rules.startDate,
    rules.endDate,
    rules.stack,
  ];
};

const getProfileRules = () => {
  return [
    rules.cv,
    rules.portfolio,
    rules.linkedIn,
    rules.twitter,
    rules.locationId,
    rules.locationName,
    rules.firstName,
    rules.lastName,
    rules.nationalityId,
    rules.nationalityName,
    rules.pathId,
    rules.pathName,
  ];
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
  getEmploymentRules,
  getProfileRules,
  sanitize,
};
