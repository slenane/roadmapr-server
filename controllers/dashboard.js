const mongoose = require("mongoose");
const User = require("../models/User.js");
const Education = require("../models/education/Education.js");
const Employment = require("../models/employment/Employment.js");
const Projects = require("../models/projects/Projects.js");
const axios = require("axios");

const getDashboard = async (req, res) => {
  try {
    User.findById(req.auth._id, async (err, user) => {
      if (user) {
        const education = await Education.findById(user.education).populate(
          "items"
        );
        const employment = await Employment.findById(user.employment).populate(
          "employmentList"
        );
        const projects = await Projects.findById(user.projects).populate(
          "projectList"
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
          education: {
            books: education.books,
            courses: education.courses,
            degrees: education.degrees,
            tutorials: education.tutorials,
          },
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
