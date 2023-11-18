const User = require("../models/User.js");
const mongoose = require("mongoose");
const Roadmap = require("../models/Roadmap.js");
const Education = require("../models/education/Education.js");
const Experience = require("../models/experience/Experience.js");
const Projects = require("../models/projects/Projects.js");
const ALERTS = require("../utils/alerts");
const Http404Error = require("../utils/errorHandling/http404Error.js");

const getRoadmap = async (req, res, next) => {
  const userId = req.auth._id;
  try {
    let roadmap = await Roadmap.findOne({ user: userId });

    if (!roadmap) {
      const user = await User.findById(userId);

      roadmap = new Roadmap({
        user: userId,
        path: user.path,
        stack: user.stack,
        education: user.education,
        projects: user.projects,
        experience: user.experience,
      });

      await roadmap.save();
    }

    const roadmapData = await generateRoadmapData(userId, roadmap);

    res.status(200).json(roadmapData);
  } catch (error) {
    next(error);
  }
};

const updateRoadmap = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.auth._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Http404Error(ALERTS.AUTH.ERROR.USER_NOT_FOUND);
    }

    const roadmap = await Roadmap.findOne({ user: userId });

    if (!roadmap) {
      throw new Http404Error(ALERTS.AUTH.ERROR.roadmap_NOT_FOUND);
    }

    roadmap.path = data.path;
    roadmap.stack = data.stack;

    await roadmap.save();

    const roadmapData = await generateRoadmapData(userId, roadmap);

    res.status(200).json({
      roadmap: roadmapData,
      successMessage: ALERTS.ROADMAP.SUCCESS.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const generateRoadmapData = async (userId, roadmap) => {
  const education = await Education.findById(roadmap.education)
    .populate("educationList")
    .exec();

  const experience = await Experience.findById(roadmap.experience)
    .populate("experienceList")
    .exec();

  const projects = await Projects.findById(roadmap.projects)
    .populate("projectList")
    .exec();

  const stackList = [
    ...education.educationList.map((item) => item.stack),
    ...experience.experienceList.map((item) => item.stack),
    ...projects.projectList.map((item) => item.stack),
  ].flat(Infinity);

  const updatedStack = [];

  stackList.forEach((language) => {
    if (!updatedStack.some((item) => item.name === language.name)) {
      updatedStack.push(language);
    }
  });

  await User.findByIdAndUpdate(
    userId,
    { stackList: updatedStack, userId },
    { new: true }
  ).exec();

  return {
    path: roadmap.path,
    stack: roadmap.stack,
    education: education.educationList,
    experience: experience.experienceList,
    projects: projects.projectList,
    github: [],
  };
};

module.exports = { getRoadmap, updateRoadmap };
