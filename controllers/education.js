const mongoose = require("mongoose");
const Education = require("../models/education/Education.js");
const EducationItem = require("../models/education/EducationItem.js");
const Http404Error = require("../utils/errorHandling/http404Error");
// const fetchEducationItem = require("../utils/fetchEducationItem.js");

const getEducation = async (req, res, next) => {
  try {
    const education = await Education.findOne({ user: req.auth._id })
      .populate("educationList")
      .exec();

    if (!education) {
      education = new Education({ user: req.auth._id }).exec();
      await education.save();
    }

    res.status(200).json(education);
  } catch (error) {
    next(error);
  }
};

const createEducationItem = async (req, res, next) => {
  if (!req.body.data) return;

  const educationItem = new EducationItem({
    ...req.body.data,
    education: req.params.id,
  });

  try {
    await educationItem.save();

    const education = Education.findById(educationItem.education)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error("Education data not found");
    }

    education["educationList"].push(educationItem);
    await education.save();

    res.status(200).json(education);
  } catch (error) {
    next(error);
  }
};

const updateEducationItem = async (req, res, next) => {
  if (!req.body.data) return;

  const educationItem = req.body.data;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Http404Error("Education item not found");
  }

  await EducationItem.findByIdAndUpdate(
    id,
    { ...educationItem, id },
    { new: true }
  );

  try {
    const education = Education.findById(req.params.id)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error("Education data not found");
    }

    res.status(201).json(education);
  } catch (error) {
    next(error);
  }
};

const bulkUpdateEducationItems = async (req, res, next) => {
  if (!req.body.data) return;

  const educationItems = req.body.data;

  educationItems.forEach(async (item) => {
    const id = item._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error("Education item not found");
    }

    await EducationItem.findByIdAndUpdate(id, { ...item, id }, { new: true });
  });

  try {
    const education = Education.findById(req.params.id)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error("Education data not found");
    }

    res.status(201).json(education);
  } catch (error) {
    next(error);
  }
};

const deleteEducationItem = async (req, res, next) => {
  if (!req.body.data) return;

  let educationItem = req.body.data;
  let educationId = educationItem.education;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Http404Error("Education item not found");
  }

  await EducationItem.findByIdAndRemove(educationItem._id);

  try {
    const education = Education.findById(educationId)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error("Education data not found");
    }
    res.status(200).json(education);
  } catch (error) {
    next(error);
  }
};

// const getItemDetails = async (req, res) => {
//   const link = req.body.link;

//   if (link.includes("amazon")) {
//     res.status(200).json(await fetchEducationItem.getAmazonProductDetails(link));
//   } else if (link.includes("udemy")) {
//     res.status(200).json(await fetchEducationItem.getUdemyProductDetails(link));
//   } else {
//     res.status(200).json({
//       message:
//         "This site is currently not supported, please enter the details manually",
//     });
//   }
// };

module.exports = {
  getEducation,
  createEducationItem,
  updateEducationItem,
  deleteEducationItem,
  bulkUpdateEducationItems,
  // getItemDetails,
};
