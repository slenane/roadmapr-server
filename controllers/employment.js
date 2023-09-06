const mongoose = require("mongoose");
const Employment = require("../models/employment/Employment.js");
const EmploymentItem = require("../models/employment/EmploymentItem.js");
// const User = require("../models/User.js");

const getEmployment = (req, res) => {
  // let employmentId;
  // if (req.params.id) {
  //   employmentId = req.params.id;
  // } else {
  //   User.findById(req.auth._id, (err, user) => {
  //     employmentId = user.employment;
  //   });
  // }

  try {
    Employment.find({ user: req.auth._id })
      .populate(["employmentList"])
      .exec((err, employment) => {
        if (err) {
          employment = new Employment({});
          employment.save();
        }

        res.status(200).json(employment[0]);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createEmploymentItem = async (req, res) => {
  const employmentItem = new EmploymentItem({
    ...req.body.data,
    employment: req.params.id,
  });

  try {
    await employmentItem.save();

    Employment.findById(employmentItem.employment)
      .populate(["employmentList"])
      .exec((err, employment) => {
        employment.employmentList.push(employmentItem);
        employment.save();

        res.status(200).json(employment);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateEmploymentItem = async (req, res) => {
  let employmentItem = req.body.data;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No item with that id");

  employmentItem = await EmploymentItem.findByIdAndUpdate(
    id,
    { ...employmentItem, id },
    { new: true }
  );

  try {
    Employment.findById(employmentItem.employment)
      .populate(["employmentList"])
      .exec((err, employment) => {
        res.status(201).json(employment);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const bulkUpdateEmploymentItems = async (req, res) => {
  if (!req.body.data) return;

  const employmentItems = req.body.data;

  employmentItems.forEach(async (item) => {
    const id = item._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No item with that id");
    }

    await EmploymentItem.findByIdAndUpdate(id, { ...item, id }, { new: true });
  });

  try {
    Employment.findById(req.params.id)
      .populate("employmentList")
      .exec((err, employment) => {
        res.status(201).json(employment);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteEmploymentItem = async (req, res) => {
  let employmentItem = req.body.data;
  let employmentId = employmentItem.employment;

  if (!mongoose.Types.ObjectId.isValid(employmentItem._id))
    return res.status(404).send("No item with that id");

  await EmploymentItem.findByIdAndRemove(employmentItem._id);

  try {
    Employment.findById(employmentId)
      .populate(["employmentList"])
      .exec((err, employment) => {
        res.status(200).json(employment);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getEmployment,
  createEmploymentItem,
  updateEmploymentItem,
  bulkUpdateEmploymentItems,
  deleteEmploymentItem,
};
