const mongoose = require("mongoose");
const Experience = require("../models/experience/Experience.js");
const ExperienceItem = require("../models/experience/ExperienceItem.js");
const Http404Error = require("../utils/errorHandling/http404Error.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const ALERTS = require("../utils/alerts.js");

const getExperience = async (req, res, next) => {
  try {
    let experience = await Experience.findOne({ user: req.auth._id })
      .populate("experienceList")
      .exec();

    if (!experience) {
      experience = new Experience({ user: req.auth._id });
      await experience.save();
    }

    res.status(200).json(experience);
  } catch (error) {
    next(error);
  }
};

const createExperienceItem = async (req, res, next) => {
  try {
    const experienceItem = new ExperienceItem({
      ...req.body,
      experience: req.params.id,
    });

    await experienceItem.save();

    const experience = await Experience.findById(experienceItem.experience)
      .populate(["experienceList"])
      .exec();

    if (!experience) {
      throw new Http404Error(ALERTS.EXPERIENCE.ERROR.NOT_FOUND);
    }

    experience.experienceList.push(experienceItem);
    await experience.save();

    res
      .status(200)
      .json({ experience, successMessage: ALERTS.EXPERIENCE.SUCCESS.CREATED });
  } catch (error) {
    next(error);
  }
};

const updateExperienceItem = async (req, res, next) => {
  try {
    const experienceItem = req.body;
    const id = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(ALERTS.EXPERIENCE.ERROR.ITEM_NOT_FOUND);
    }

    await ExperienceItem.findByIdAndUpdate(
      id,
      { ...experienceItem, id },
      { new: true }
    );

    const experience = await Experience.findById(experienceItem.experience)
      .populate("experienceList")
      .exec();

    if (!experience) {
      throw new Http404Error(ALERTS.EXPERIENCE.ERROR.NOT_FOUND);
    }

    res
      .status(201)
      .json({ experience, successMessage: ALERTS.EXPERIENCE.SUCCESS.UPDATED });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateExperienceItems = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const experienceItems = req.body;

    experienceItems.forEach(async (item) => {
      const id = item._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Http404Error(ALERTS.EXPERIENCE.ERROR.ITEM_NOT_FOUND);
      }

      await ExperienceItem.findByIdAndUpdate(
        id,
        { ...item, id },
        { new: true }
      );
    });

    const experience = await Experience.findById(req.params.id)
      .populate("experienceList")
      .exec();

    if (!experience) {
      throw new Http404Error(ALERTS.EXPERIENCE.ERROR.NOT_FOUND);
    }

    res.status(201).json({
      experience,
      successMessage: ALERTS.EXPERIENCE.SUCCESS.ITEMS_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExperienceItem = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const experienceItem = req.body;
    const experienceId = experienceItem.experience;

    if (!mongoose.Types.ObjectId.isValid(experienceItem._id)) {
      throw new Http404Error(ALERTS.EXPERIENCE.ERROR.ITEM_NOT_FOUND);
    }

    await ExperienceItem.findByIdAndRemove(experienceItem._id);

    const experience = await Experience.findById(experienceId)
      .populate("experienceList")
      .exec();

    if (!experience) {
      throw new Http404Error(ALERTS.EXPERIENCE.ERROR.NOT_FOUND);
    }

    res.status(200).json({
      experience,
      successMessage: ALERTS.EXPERIENCE.SUCCESS.REMOVED,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperience,
  createExperienceItem,
  updateExperienceItem,
  bulkUpdateExperienceItems,
  deleteExperienceItem,
};
