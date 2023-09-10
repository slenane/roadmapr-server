const mongoose = require("mongoose");
const User = require("../models/User.js");
const Education = require("../models/education/Education.js");
const Employment = require("../models/employment/Employment.js");
const Projects = require("../models/projects/Projects.js");
const axios = require("axios");

const getDashboard = async (req, res) => {
  const id = req.auth._id;
  try {
    User.findById(id, async (err, user) => {
      if (user) {
        const education = await Education.findById(user.education).populate(
          "educationList"
        );
        const employment = await Employment.findById(user.employment).populate(
          "employmentList"
        );
        const projects = await Projects.findById(user.projects).populate(
          "projectList"
        );

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
        );
        // const githubResponse = await axios.get(
        //   `https://api.github.com/users/${user.github}/repos?per_page=100`
        // );

        // const github = [
        //   ...githubResponse.data.map((repo) => {
        //     return {
        //       name: repo.name,
        //       id: repo.id,
        //       url: repo.html_url,
        //       language: repo.language,
        //       forks: repo.forks,
        //       created_at: new Date(repo.created_at),
        //       updated_at: new Date(repo.updated_at),
        //     };
        //   }),
        // ];

        const dashboard = {
          education: education.educationList,
          employment: employment.employmentList,
          projects: projects.projectList,
          github: [],
        };
        res.status(200).json(dashboard);
      }
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getDashboard };
