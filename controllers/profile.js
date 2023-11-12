const mongoose = require("mongoose");
const User = require("../models/User.js");
const Education = require("../models/education/Education.js");
const Experience = require("../models/experience/Experience.js");
const Projects = require("../models/projects/Projects.js");
const Http404Error = require("../utils/errorHandling/http404Error.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const ALERTS = require("../utils/alerts");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    const education = await Education.findById(user.education)
      .populate({
        path: "educationList",
        match: { startDate: { $ne: null } },
      })
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.NOT_FOUND);
    }

    const experience = await Experience.findById(user.experience)
      .populate({
        path: "experienceList",
        match: { startDate: { $ne: null } },
      })
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EXPERIENCE.ERROR.NOT_FOUND);
    }

    const projects = await Projects.findById(user.projects)
      .populate({
        path: "projectList",
        match: { startDate: { $ne: null } },
      })
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.PROJECTS.ERROR.NOT_FOUND);
    }

    const updatedUser = {
      ...user.toObject(),
      educationList: sortItemsByDate(education.educationList),
      experienceList: sortItemsByDate(experience.experienceList),
      projectList: sortItemsByDate(projects.projectList),
    };

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
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

    res
      .status(200)
      .json({ user, successMessage: ALERTS.PROFILE.SUCCESS.UPDATED });
  } catch (error) {
    next(error);
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Http400Error(ALERTS.PROFILE.ERROR.FILE_NOT_PROVIDED);
    }

    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { profileImage: req.file.location },
      { new: true }
    );

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    res.status(200).json({
      user,
      successMessage: ALERTS.PROFILE.SUCCESS.PROFILE_IMAGE_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const updateCoverImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Http400Error(ALERTS.PROFILE.ERROR.FILE_NOT_PROVIDED);
    }

    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { coverImage: req.file.location },
      { new: true }
    );

    if (!user) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    res.status(200).json({
      user,
      successMessage: ALERTS.PROFILE.SUCCESS.COVER_IMAGE_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const sortItemsByDate = (items) => {
  return items.sort((a, b) => {
    if (!a.endDate && !b.endDate) {
      return new Date(a.startDate) - new Date(b.startDate);
    }
    if (!a.endDate && b.endDate) return -1;
    if (a.endDate && !b.endDate) return 1;
    return new Date(b.endDate) - new Date(a.endDate);
  });
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
};
