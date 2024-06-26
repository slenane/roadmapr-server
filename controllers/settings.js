const mongoose = require("mongoose");
const User = require("../models/User.js");
const EducationItem = require("../models/education/EducationItem.js");
const Education = require("../models/education/Education.js");
const ExperienceItem = require("../models/experience/ExperienceItem.js");
const Experience = require("../models/experience/Experience.js");
const ProjectItem = require("../models/projects/ProjectItem.js");
const Projects = require("../models/projects/Projects.js");
const Roadmap = require("../models/Roadmap.js");
const Http500Error = require("../utils/errorHandling/http500Error.js");
const Http404Error = require("../utils/errorHandling/http404Error.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const ALERTS = require("../utils/alerts.js");
const config = require("../config");
const crypto = require("crypto");
const { getEmailUpdateVerification } = require("../utils/email/email.js");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    const settings = extractSettings(user);

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const data = req.body;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    const user = await User.findByIdAndUpdate(id, { ...data }, { new: true });

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    const settings = extractSettings(user);

    res
      .status(200)
      .json({ settings, successMessage: ALERTS.SETTINGS.SUCCESS.UPDATED });
  } catch (error) {
    next(error);
  }
};

const removeGithub = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    user.github = {
      id: "",
      username: "",
    };

    await user.save();

    const roadmap = await Roadmap.findOne({ user: id });

    if (!roadmap) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    roadmap.github = undefined;

    await roadmap.save();

    const settings = extractSettings(user);

    res
      .status(200)
      .json({ settings, successMessage: ALERTS.SETTINGS.SUCCESS.UPDATED });
  } catch (error) {
    next(error);
  }
};

const updateEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    user.emailVerification.emailToken = crypto.randomBytes(64).toString("hex");
    user.emailVerification.updatedEmail = req.body.email;

    await user.save();

    // Create the promise and SES service object
    const verificationLink = `http://${req.headers.host}/api/settings/verify-email-update?token=${user.emailVerification.emailToken}`;
    const verificationEmail = getEmailUpdateVerification(
      user.emailVerification.updatedEmail,
      verificationLink,
      req.body.preferredLanguage
    );

    sgMail
      .send(verificationEmail)
      .then(() => {
        res.status(200).json({
          successMessage: ALERTS.AUTH.SUCCESS.EMAIL_VERIFICATION,
          successValue: user.emailVerification.updatedEmail,
        });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

const verifyEmailUpdate = async (req, res, next) => {
  try {
    const user = await User.findOne({
      "emailVerification.emailToken": req.query.token,
    });

    if (user && user.emailVerification) {
      user.email = user.emailVerification.updatedEmail;
      user.emailVerification.updatedEmail = null;
      await user.save();
    }

    res.redirect(config.ENVIRONMENT.apiUrl + "/login?verified=true");
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    await user.setPassword(req.body.password);
    await user.save();

    const settings = extractSettings(user);

    res.status(200).json({
      settings,
      successMessage: ALERTS.SETTINGS.SUCCESS.PASSWORD_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const updateExistingPassword = async (req, res, next) => {
  try {
    if (req.body.current === req.body.new) {
      throw new Http400Error(ALERTS.SETTINGS.ERROR.PASSWORDS_MATCH);
    }

    const user = await User.findById(req.auth._id);
    if (!user) throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);

    const currentPasswordValid = await user.validPassword(req.body.current);
    if (!currentPasswordValid) {
      throw new Http400Error(ALERTS.SETTINGS.ERROR.CURRENT_PASSWORD_INCORRECT);
    }

    await user.setPassword(req.body.new);
    await user.save();

    const settings = extractSettings(user);

    res.status(200).json({
      settings,
      successMessage: ALERTS.SETTINGS.SUCCESS.PASSWORD_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  const userId = req.auth._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    // Delete Education
    const education = await Education.findOne({ user: userId });
    if (!education) {
      throw new Http500Error(ALERTS.SETTINGS.ERROR.EDUCATION_DATA);
    }
    await EducationItem.deleteMany({ education: education._id });
    await Education.deleteOne({ user: userId });

    // Delete Experience
    const experience = await Experience.findOne({ user: userId });
    if (!experience) {
      throw new Http500Error(ALERTS.SETTINGS.ERROR.EXPERIENCE);
    }
    await ExperienceItem.deleteMany({ experience: experience._id });
    await Experience.deleteOne({ user: userId });

    // Delete Projects
    const projects = await Projects.findOne({ user: userId });
    if (!projects) {
      throw new Http500Error(ALERTS.SETTINGS.ERROR.PROJECT_DATA);
    }
    await ProjectItem.deleteMany({ projects: projects._id });
    await Projects.deleteOne({ user: userId });

    // Delete User
    await User.deleteOne({ _id: userId });

    res.status(200).json({ successMessage: ALERTS.SETTINGS.SUCCESS.DELETED });
  } catch (error) {
    next(error);
  }
};

const extractSettings = (user) => {
  return {
    email: user.email,
    github: user.github,
    firstName: user.firstName,
    lastName: user.lastName,
    notifications: user.notifications,
    preferredLanguage: user.preferredLanguage,
    theme: user.theme,
    userId: user._id,
    username: user.username,
    hasPassword: user.hash && user.salt ? true : false,
    emailUpdatePending: user.emailVerification?.updatedEmail,
  };
};

module.exports = {
  getSettings,
  updateSettings,
  removeGithub,
  updateEmail,
  verifyEmailUpdate,
  updatePassword,
  updateExistingPassword,
  deleteAccount,
};
