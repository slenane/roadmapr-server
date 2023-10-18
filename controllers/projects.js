const mongoose = require("mongoose");
const Projects = require("../models/projects/Projects.js");
const ProjectItem = require("../models/projects/ProjectItem.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const Http404Error = require("../utils/errorHandling/http404Error.js");

const getProjects = async (req, res, next) => {
  try {
    const projects = await Projects.findOne({ user: req.auth._id })
      .populate("projectList")
      .exec();

    if (!projects) {
      projects = new Projects({ user: req.auth._id }).exec();
      await projects.save();
    }

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const createProjectItem = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error("No information was provided");
    }

    const projectItem = new ProjectItem({
      ...req.body.data,
      projects: req.params.id,
    });

    await projectItem.save();

    const projects = await Projects.findById(projectItem.projects)
      .populate("projectList")
      .exec();

    if (!projects) {
      throw new Http404Error("Project data not found");
    }

    projects.projectList.push(projectItem);
    await projects.save();

    res.status(200).json({ projects, successMessage: "Projects Updated" });
  } catch (error) {
    next(error);
  }
};

const updateProjectItem = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error("No information was provided");
    }

    const projectItem = req.body.data;
    const id = req.body.data._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error("Project item not found");
    }

    await ProjectItem.findByIdAndUpdate(
      id,
      { ...projectItem, id },
      { new: true }
    );

    const projects = await Projects.findById(projectItem.projects)
      .populate("projectList")
      .exec();

    if (!projects) {
      throw new Http404Error("Project data not found");
    }

    res.status(201).json({ projects, successMessage: "Projects Updated" });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateProjectItems = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error("No information was provided");
    }

    const projectItems = req.body.data;

    projectItems.forEach(async (item) => {
      const id = item._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Http404Error("Project item not found");
      }

      await ProjectItem.findByIdAndUpdate(id, { ...item, id }, { new: true });
    });

    const projects = await Projects.findById(req.params.id)
      .populate("projectList")
      .exec();

    if (!projects) {
      throw new Http404Error("Project data not found");
    }

    res.status(201).json({ projects, successMessage: "Project Items Updated" });
  } catch (error) {
    next(error);
  }
};

const deleteProjectItem = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error("No information was provided");
    }

    const projectItem = req.body.data;
    const projectsId = projectItem.projects;
    const id = req.body.data._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error("Project item not found");
    }

    await ProjectItem.findByIdAndRemove(projectItem._id);

    const projects = await Projects.findById(projectsId)
      .populate("projectList")
      .exec();

    if (!projects) {
      throw new Http404Error("Project data not found");
    }

    res.status(200).json({ projects, successMessage: "Project Removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProjectItem,
  updateProjectItem,
  bulkUpdateProjectItems,
  deleteProjectItem,
};
