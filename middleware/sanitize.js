const { body, validationResult } = require("express-validator");
const ALERTS = require("../utils/alerts");
const Http400Error = require("../utils/errorHandling/http400Error");

const validUrlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?[a-z\d\.\-_%&=\+]+)?$/;

const validYouTubeLink =
  /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/;

const validUsernamePattern = /^[^\s]{3,20}$/;

const validateOptionalDate = (value) => {
  if (!!value === false) return true;
  return !isNaN(Date.parse(value));
};

const validateLink = (value) => {
  return value.match(validUrlRegex) || value.match(validYouTubeLink);
};

const validateOptionalLink = (value) => {
  if (value === "") return true;
  return value.match(validUrlRegex) || value.match(validYouTubeLink);
};

const rules = {
  username: body("username", ALERTS.AUTH.ERROR.USERNAME_INVALID)
    .matches(validUsernamePattern)
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
  newPassword: body("current", ALERTS.AUTH.ERROR.PASSWORD_INVALID)
    .isLength({ min: 6, max: 20 })
    .trim()
    .escape(),
  currentPassword: body("new", ALERTS.AUTH.ERROR.PASSWORD_INVALID)
    .isLength({ min: 6, max: 20 })
    .trim()
    .escape(),
  startDate: body("startDate", ALERTS.START_DATE_INVALID)
    .custom(validateOptionalDate)
    .escape(),
  endDate: body("endDate", ALERTS.END_DATE_INVALID)
    .custom(validateOptionalDate)
    .escape(),
  title: body("title", ALERTS.TITLE_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  author: body("author", ALERTS.EDUCATION.ERROR.AUTHOR_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  company: body("company", ALERTS.EXPERIENCE.ERROR.COMPANY_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  role: body("role", ALERTS.EXPERIENCE.ERROR.ROLE_INVALID)
    .isLength({ min: 3 })
    .trim()
    .escape(),
  stack: body("stack").custom((value) => {
    if (!value.length) {
      throw new Error(ALERTS.STACK_INVALID);
    }
    return true;
  }),
  description: body("description", ALERTS.DESCRIPTION_INVALID)
    .optional()
    .trim()
    .escape(),
  notes: body("notes", ALERTS.NOTES_INVALID).optional().trim().escape(),
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
  cv: body("links.*.cv", ALERTS.LINK_INVALID).custom(validateOptionalLink),
  linkedIn: body("links.*.linkedIn", ALERTS.LINK_INVALID).custom(
    validateOptionalLink
  ),
  portfolio: body("links.*.portfolio", ALERTS.LINK_INVALID).custom(
    validateOptionalLink
  ),
  x: body("links.*.x", ALERTS.LINK_INVALID).custom(validateOptionalLink),
  project: body("project", ALERTS.LINK_INVALID).custom(validateOptionalLink),
  companyLink: body("companyLink", ALERTS.LINK_INVALID).custom(
    validateOptionalLink
  ),
  github: body("github", ALERTS.LINK_INVALID).custom(validateOptionalLink),
  projectLink: body("link", ALERTS.LINK_INVALID).custom(validateOptionalLink),
  link: body("link", ALERTS.LINK_INVALID).custom(validateLink),
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
    rules.description,
  ];
};

const getExperienceRules = () => {
  return [
    body("type").custom((value) => {
      if (value !== "freelance" && value !== "professional") {
        throw new Error(ALERTS.EXPERIENCE.ERROR.TYPE_INVALID);
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
    rules.description,
  ];
};

const getProfileRules = () => {
  return [
    rules.cv,
    rules.portfolio,
    rules.linkedIn,
    rules.x,
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

const getProjectsRules = () => {
  return [
    body("type").custom((value) => {
      if (value !== "educational" && value !== "personal") {
        throw new Error(ALERTS.PROJECTS.ERROR.TYPE_INVALID);
      }
      return true;
    }),
    rules.title,
    rules.startDate,
    rules.endDate,
    rules.stack,
    rules.projectLink,
    rules.github,
    rules.description,
    rules.notes,
  ];
};

getEmailRules = () => {
  return [rules.email];
};

getPasswordRules = () => {
  return [rules.password];
};

getExistingPasswordRules = () => {
  return [rules.currentPassword, rules.newPassword];
};

getSettingsRules = () => {
  return [
    body("username", ALERTS.AUTH.ERROR.USERNAME_INVALID)
      .optional()
      .matches(validUsernamePattern)
      .trim()
      .escape(),
    body("firstName", ALERTS.PROFILE.ERROR.FIRST_NAME_INVALID)
      .optional()
      .trim()
      .escape(),
    body("lastName", ALERTS.PROFILE.ERROR.LAST_NAME_INVALID)
      .optional()
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
  getExperienceRules,
  getProfileRules,
  getProjectsRules,
  getEmailRules,
  getPasswordRules,
  getExistingPasswordRules,
  getSettingsRules,
  sanitize,
};
