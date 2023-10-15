const mongoose = require("mongoose");
const Employment = require("../models/employment/Employment.js");
const EmploymentItem = require("../models/employment/EmploymentItem.js");
const Http404Error = require("../utils/errorHandling/http404Error");
const Http400Error = require("../utils/errorHandling/http400Error.js");

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
  if (!req.body.data) {
    throw new Http400Error("No information was provided");
  }

  const employmentItem = new EmploymentItem({
    ...req.body.data,
    employment: req.params.id,
  });

  try {
    await employmentItem.save();

    const employment = await Employment.findById(employmentItem.employment)
      .populate(["employmentList"])
      .exec();

    if (!employment) {
      throw new Http404Error("Employment data not found");
    }

    employment.employmentList.push(employmentItem);
    await employment.save();

    res.status(200).json(employment);
  } catch (error) {
    next(error);
  }
};

const updateEmploymentItem = async (req, res, next) => {
  if (!req.body.data) {
    throw new Http400Error("No information was provided");
  }

  const employmentItem = req.body.data;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Http404Error("Employment item not found");
  }

  await EmploymentItem.findByIdAndUpdate(
    id,
    { ...employmentItem, id },
    { new: true }
  );

  try {
    const employment = await Employment.findById(employmentItem.employment)
      .populate("employmentList")
      .exec();

    if (!employment) {
      throw new Http404Error("Employment data not found");
    }

    res.status(201).json(employment);
  } catch (error) {
    next(error);
  }
};

const bulkUpdateEmploymentItems = async (req, res, next) => {
  if (!req.body.data) {
    throw new Http400Error("No information was provided");
  }

  const employmentItems = req.body.data;

  employmentItems.forEach(async (item) => {
    const id = item._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error("Employment item not found");
    }

    await EmploymentItem.findByIdAndUpdate(id, { ...item, id }, { new: true });
  });

  try {
    const employment = await Employment.findById(req.params.id)
      .populate("employmentList")
      .exec();

    if (!employment) {
      throw new Http404Error("Employment data not found");
    }

    res.status(201).json(employment);
  } catch (error) {
    next(error);
  }
};

const deleteEmploymentItem = async (req, res, next) => {
  if (!req.body.data) {
    throw new Http400Error("No information was provided");
  }

  const employmentItem = req.body.data;
  const employmentId = employmentItem.employment;

  if (!mongoose.Types.ObjectId.isValid(employmentItem._id)) {
    throw new Http404Error("Employment item not found");
  }

  await EmploymentItem.findByIdAndRemove(employmentItem._id);

  try {
    const employment = await Employment.findById(employmentId)
      .populate("employmentList")
      .exec();

    if (!employment) {
      throw new Http404Error("Employment data not found");
    }

    res.status(200).json(employment);
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
