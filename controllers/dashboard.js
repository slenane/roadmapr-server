const User = require("../models/User.js");
const Education = require("../models/education/Education.js");
const Employment = require("../models/employment/Employment.js");
const Projects = require("../models/projects/Projects.js");
// const axios = require("axios"); // Get github data
const Http404Error = require("../utils/errorHandling/http404Error");

const getDashboard = async (req, res, next) => {
  const id = req.auth._id;
  try {
    const user = await User.findById(id).exec();

    if (!user) {
      throw new Http404Error("User not found");
    }

    const education = await Education.findById(user.education)
      .populate("educationList")
      .exec();

    const employment = await Employment.findById(user.employment)
      .populate("employmentList")
      .exec();

    const projects = await Projects.findById(user.projects)
      .populate("projectList")
      .exec();

    const stackList = [
      ...education.educationList.map((item) => item.stack),
      ...employment.employmentList.map((item) => item.stack),
      ...projects.projectList.map((item) => item.stack),
    ].flat(Infinity);

    const updatedStack = [];

    stackList.forEach((language) => {
      if (!updatedStack.some((item) => item.name === language.name)) {
        updatedStack.push(language);
      }
    });

    await User.findByIdAndUpdate(
      id,
      { stack: updatedStack, id },
      { new: true }
    ).exec();

    const dashboard = {
      education: education.educationList,
      employment: employment.employmentList,
      projects: projects.projectList,
      github: [],
    };

    res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
