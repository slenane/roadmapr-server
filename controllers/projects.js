const mongoose = require("mongoose");
const Projects = require("../models/projects/Projects.js");
const ProjectItem = require("../models/projects/ProjectItem.js");
// const User = require("../models/User.js");

const getProjects = (req, res) => {
  // let projectsId;
  // if (req.params.id) {
  //   projectsId = req.params.id;
  // } else {
  //   User.findById(req.auth._id, (err, user) => {
  //     projectsId = user.projects;
  //   });
  // }

  try {
    Projects.find({ user: req.auth._id })
      .populate("projectList")
      .exec((err, projects) => {
        if (err) {
          projects = new Projects({});
          projects.save();
        }

        res.status(200).json(projects[0]);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createProjectItem = async (req, res) => {
  const projectItem = new ProjectItem({
    ...req.body.data,
    projects: req.params.id,
  });

  try {
    await projectItem.save();

    Projects.findById(projectItem.projects)
      .populate("projectList")
      .exec((err, projects) => {
        projects.projectList.push(projectItem);
        projects.save();

        res.status(200).json(projects);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateProjectItem = async (req, res) => {
  let projectItem = req.body.data;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No item with that id");

  projectItem = await ProjectItem.findByIdAndUpdate(
    id,
    { ...projectItem, id },
    { new: true }
  );

  try {
    Projects.findById(projectItem.projects)
      .populate("projectList")
      .exec((err, projects) => {
        res.status(201).json(projects);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const bulkUpdateProjectItems = async (req, res) => {
  if (!req.body.data) return;

  const projectItems = req.body.data;

  projectItems.forEach(async (item) => {
    const id = item._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No item with that id");
    }

    await ProjectItem.findByIdAndUpdate(id, { ...item, id }, { new: true });
  });

  try {
    Projects.findById(req.params.id)
      .populate("projectList")
      .exec((err, projects) => {
        res.status(201).json(projects);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteProjectItem = async (req, res) => {
  let projectItem = req.body.data;
  let projectsId = projectItem.projects;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No item with that id");

  await ProjectItem.findByIdAndRemove(projectItem._id);

  try {
    Projects.findById(projectsId)
      .populate(["projectList"])
      .exec((err, projects) => {
        res.status(200).json(projects);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProjectItem,
  updateProjectItem,
  bulkUpdateProjectItems,
  deleteProjectItem,
};
