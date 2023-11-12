const User = require("../models/User.js");
const Roadmap = require("../models/Roadmap.js");
const Education = require("../models/education/Education.js");
const Experience = require("../models/experience/Experience.js");
const Projects = require("../models/projects/Projects.js");

const getRoadmap = async (req, res, next) => {
  const id = req.auth._id;
  try {
    let roadmap = await Roadmap.findOne({ user: id });

    if (!roadmap) {
      const user = await User.findById(id);

      roadmap = new Roadmap({
        user: id,
        education: user.education,
        projects: user.projects,
        experience: user.experience,
      });

      await roadmap.save();
    }

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
      id,
      { stack: updatedStack, id },
      { new: true }
    ).exec();

    const roadmapConfig = {
      education: education.educationList,
      experience: experience.experienceList,
      projects: projects.projectList,
      github: [],
    };

    res.status(200).json(roadmapConfig);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRoadmap };
