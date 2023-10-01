const mongoose = require("mongoose");
const User = require("../models/User.js");
const EducationItem = require("../models/education/EducationItem.js");
const Education = require("../models/education/Education.js");
const EmploymentItem = require("../models/employment/EmploymentItem.js");
const Employment = require("../models/employment/Employment.js");
const ProjectItem = require("../models/projects/ProjectItem.js");
const Projects = require("../models/projects/Projects.js");

const getSettings = async (req, res) => {
  try {
    User.findById(req.auth._id, (err, user) => {
      res.status(200).json({
        email: user.email,
        github: user.github,
        name: user.name,
        notifications: user.notifications,
        preferredLanguage: user.preferredLanguage,
        theme: user.theme,
        userId: user._id,
        username: user.username,
      });
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  let data = req.body.data;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No item with that id");
  }

  try {
    const user = await User.findByIdAndUpdate(id, { ...data }, { new: true });
    res.status(200).json({
      email: user.email,
      github: user.github,
      name: user.name,
      notifications: user.notifications,
      preferredLanguage: user.preferredLanguage,
      theme: user.theme,
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    User.findById(req.auth._id, async (err, user) => {
      if (req.body.password) {
        await user.setPassword(req.body.password);
        await user.save();
      }

      res.status(200).json({
        email: user.email,
        github: user.github,
        name: user.name,
        notifications: user.notifications,
        preferredLanguage: user.preferredLanguage,
        theme: user.theme,
        userId: user._id,
        username: user.username,
      });
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.auth._id;

    // Delete Education
    const education = await Education.findOne({ user: userId });
    if (education) {
      await EducationItem.deleteMany({ education: education._id });
      await Education.deleteOne({ user: userId });
    }

    // Delete Employment
    const employment = await Employment.findOne({ user: userId });
    if (employment) {
      await EmploymentItem.deleteMany({ employment: employment._id });
      await Employment.deleteOne({ user: userId });
    }

    // Delete Projects
    const projects = await Projects.findOne({ user: userId });
    if (projects) {
      await ProjectItem.deleteMany({ projects: projects._id });
      await Projects.deleteOne({ user: userId });
    }

    // Delete User
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings, updatePassword, deleteAccount };
