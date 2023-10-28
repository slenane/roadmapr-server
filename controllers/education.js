const mongoose = require("mongoose");
const Education = require("../models/education/Education.js");
const EducationItem = require("../models/education/EducationItem.js");
const Http404Error = require("../utils/errorHandling/http404Error");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const {
  generateEducationItemMetadata,
} = require("../utils/educationMetadata.js");
// const fetchEducationItem = require("../utils/fetchEducationItem.js");
const ALERTS = require("../utils/alerts.js");

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
  try {
    if (!req.body.data) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const educationItem = new EducationItem({
      ...req.body.data,
      education: req.params.id,
    });

    educationItem.metadata = generateEducationItemMetadata(educationItem.link);
    console.log(educationItem).metadata;

    await educationItem.save();

    const education = await Education.findById(educationItem.education)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.NOT_FOUND);
    }

    education["educationList"].push(educationItem);
    await education.save();

    res.status(200).json({
      education,
      successMessage: ALERTS.EDUCATION.SUCCESS.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const updateEducationItem = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const educationItem = req.body.data;
    const id = req.body.data._id;

    if (educationItem.link) {
      educationItem.metadata = generateEducationItemMetadata(
        educationItem.link
      );
      console.log(educationItem.metadata);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.ITEM_NOT_FOUND);
    }

    await EducationItem.findByIdAndUpdate(
      id,
      { ...educationItem, id },
      { new: true }
    );

    const education = await Education.findById(educationItem.education)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.NOT_FOUND);
    }

    res.status(201).json({
      education,
      successMessage: ALERTS.EDUCATION.SUCCESS.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateEducationItems = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const educationItems = req.body.data;

    await educationItems.forEach(async (item) => {
      const id = item._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Http404Error(ALERTS.EDUCATION.ERROR.ITEM_NOT_FOUND);
      }

      await EducationItem.findByIdAndUpdate(id, { ...item, id }, { new: true });
    });

    const education = await Education.findById(req.params.id)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.NOT_FOUND);
    }

    res.status(201).json({
      education,
      successMessage: ALERTS.EDUCATION.SUCCESS.ITEMS_UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEducationItem = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    let educationItem = req.body.data;
    let educationId = educationItem.education;
    const id = req.body.data._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.ITEM_NOT_FOUND);
    }

    await EducationItem.findByIdAndRemove(educationItem._id);

    const education = await Education.findById(educationId)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.NOT_FOUND);
    }
    res.status(200).json({
      education,
      successMessage: ALERTS.EDUCATION.SUCCESS.ITEM_REMOVED,
    });
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
