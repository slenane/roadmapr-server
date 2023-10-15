const mongoose = require("mongoose");
const User = require("../models/User.js");
const EducationItem = require("../models/education/EducationItem.js");
const Education = require("../models/education/Education.js");
const EmploymentItem = require("../models/employment/EmploymentItem.js");
const Employment = require("../models/employment/Employment.js");
const ProjectItem = require("../models/projects/ProjectItem.js");
const Projects = require("../models/projects/Projects.js");
const Http500Error = require("../utils/errorHandling/http500Error.js");
const Http404Error = require("../utils/errorHandling/http404Error.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");

const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      throw new Http404Error("User not found");
    }

    const settings = extractSettings(user);

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  if (!req.body.data) {
    throw new Http400Error("No information was provided");
  }

  const data = req.body.data;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Http404Error("Settings not found");
  }

  try {
    const user = await User.findByIdAndUpdate(id, { ...data }, { new: true });

    if (!user) {
      throw new Http404Error("User not found");
    }

    const settings = extractSettings(user);

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  if (!req.body.password) {
    throw new Http400Error("No information was provided");
  }

  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      throw new Http404Error("User not found");
    }

    await user.setPassword(req.body.password);
    await user.save();

    const settings = extractSettings(user);

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  const userId = req.auth._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Http404Error("User not found");
    }

    // Delete Education
    const education = await Education.findOne({ user: userId });
    if (!education) {
      throw new Http500Error("Education data could not be deleted");
    }
    await EducationItem.deleteMany({ education: education._id });
    await Education.deleteOne({ user: userId });

    // Delete Employment
    const employment = await Employment.findOne({ user: userId });
    if (!employment) {
      throw new Http500Error("Employment data could not be deleted");
    }
    await EmploymentItem.deleteMany({ employment: employment._id });
    await Employment.deleteOne({ user: userId });

    // Delete Projects
    const projects = await Projects.findOne({ user: userId });
    if (!projects) {
      throw new Http500Error("Project data could not be deleted");
    }
    await ProjectItem.deleteMany({ projects: projects._id });
    await Projects.deleteOne({ user: userId });

    // Delete User
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "Account deleted successfully" });
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
  };
};

module.exports = { getSettings, updateSettings, updatePassword, deleteAccount };
