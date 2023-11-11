const mongoose = require("mongoose");
const Employment = require("../models/employment/Employment.js");
const EmploymentItem = require("../models/employment/EmploymentItem.js");
const Http404Error = require("../utils/errorHandling/http404Error");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const ALERTS = require("../utils/alerts.js");

const getEmployment = async (req, res, next) => {
  try {
    const employment = await Employment.findOne({ user: req.auth._id })
      .populate("employmentList")
      .exec();

    if (!employment) {
      employment = new Employment({ user: req.auth._id }).exec();
      await employment.save();
    }

    res.status(200).json(employment);
  } catch (error) {
    next(error);
  }
};

const createEmploymentItem = async (req, res, next) => {
  try {
    const employmentItem = new EmploymentItem({
      ...req.body,
      employment: req.params.id,
    });

    await employmentItem.save();

    const employment = await Employment.findById(employmentItem.employment)
      .populate(["employmentList"])
      .exec();

    if (!employment) {
      throw new Http404Error(ALERTS.EMPLOYMENT.ERROR.NOT_FOUND);
    }

    employment.employmentList.push(employmentItem);
    await employment.save();

    res
      .status(200)
      .json({ employment, successMessage: ALERTS.EMPLOYMENT.SUCCESS.CREATED });
  } catch (error) {
    next(error);
  }
};

const updateEmploymentItem = async (req, res, next) => {
  try {
    const employmentItem = req.body;
    const id = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(ALERTS.EMPLOYMENT.ERROR.ITEM_NOT_FOUND);
    }

    await EmploymentItem.findByIdAndUpdate(
      id,
      { ...employmentItem, id },
      { new: true }
    );

    const employment = await Employment.findById(employmentItem.employment)
      .populate("employmentList")
      .exec();

    if (!employment) {
      throw new Http404Error(ALERTS.EMPLOYMENT.ERROR.NOT_FOUND);
    }

    res
      .status(201)
      .json({ employment, successMessage: ALERTS.EMPLOYMENT.SUCCESS.UPDATED });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateEmploymentItems = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const employmentItems = req.body;

    employmentItems.forEach(async (item) => {
      const id = item._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Http404Error(ALERTS.EMPLOYMENT.ERROR.ITEM_NOT_FOUND);
      }

      await EmploymentItem.findByIdAndUpdate(
        id,
        { ...item, id },
        { new: true }
      );
    });

    const employment = await Employment.findById(req.params.id)
      .populate("employmentList")
      .exec();

    if (!employment) {
      throw new Http404Error(ALERTS.EMPLOYMENT.ERROR.NOT_FOUND);
    }

    res.status(201).json({
      employment,
      successMessage: ALERTS.EMPLOYMENT.SUCCESS.ITEMS_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmploymentItem = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const employmentItem = req.body;
    const employmentId = employmentItem.employment;

    if (!mongoose.Types.ObjectId.isValid(employmentItem._id)) {
      throw new Http404Error(ALERTS.EMPLOYMENT.ERROR.ITEM_NOT_FOUND);
    }

    await EmploymentItem.findByIdAndRemove(employmentItem._id);

    const employment = await Employment.findById(employmentId)
      .populate("employmentList")
      .exec();

    if (!employment) {
      throw new Http404Error(ALERTS.EMPLOYMENT.ERROR.NOT_FOUND);
    }

    res.status(200).json({
      employment,
      successMessage: ALERTS.EMPLOYMENT.SUCCESS.REMOVED,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployment,
  createEmploymentItem,
  updateEmploymentItem,
  bulkUpdateEmploymentItems,
  deleteEmploymentItem,
};
