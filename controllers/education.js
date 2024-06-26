const mongoose = require("mongoose");
const Education = require("../models/education/Education.js");
const EducationItem = require("../models/education/EducationItem.js");
const Http404Error = require("../utils/errorHandling/http404Error");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const {
  updateRecommendations,
  removeRecommendations,
} = require("../utils/recommendations/educationRecommendations.js");
const ALERTS = require("../utils/alerts.js");

const getEducation = async (req, res, next) => {
  try {
    let education = await Education.findOne({ user: req.auth._id })
      .populate("educationList")
      .exec();

    if (!education) {
      education = new Education({ user: req.auth._id });
      await education.save();
    }

    res.status(200).json(education);
  } catch (error) {
    next(error);
  }
};

const createEducationItem = async (req, res, next) => {
  try {
    const educationItem = new EducationItem({
      ...req.body,
      education: req.params.id,
    });

    educationItem.metadata = await updateRecommendations(
      req.auth,
      educationItem,
      undefined, // No original value for metadata on new item
      next
    );

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
      successMessage:
        educationItem.type === "book"
          ? ALERTS.EDUCATION.SUCCESS.BOOK.CREATED
          : ALERTS.EDUCATION.SUCCESS.COURSE.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

const updateEducationItem = async (req, res, next) => {
  try {
    let educationItem = req.body;
    const id = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(
        educationItem.type === "book"
          ? ALERTS.EDUCATION.ERROR.BOOK_NOT_FOUND
          : ALERTS.EDUCATION.ERROR.COURSE_NOT_FOUND
      );
    }

    originalEducationItem = await EducationItem.findOne({
      _id: id,
    });

    const originalMetadata = originalEducationItem?.metadata;

    educationItem.metadata = await updateRecommendations(
      req.auth,
      educationItem,
      originalMetadata,
      next
    );

    educationItem = await EducationItem.findByIdAndUpdate(
      id,
      { ...educationItem, id },
      { new: true }
    );

    await educationItem.save();

    const education = await Education.findById(educationItem.education)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.NOT_FOUND);
    }

    res.status(201).json({
      education,
      successMessage:
        educationItem.type === "book"
          ? ALERTS.EDUCATION.SUCCESS.BOOK.UPDATED
          : ALERTS.EDUCATION.SUCCESS.COURSE.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

const bulkUpdateEducationItems = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    const educationItems = req.body;

    await educationItems.forEach(async (item) => {
      const id = item._id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Http404Error(
          item.type === "book"
            ? ALERTS.EDUCATION.ERROR.BOOK_NOT_FOUND
            : ALERTS.EDUCATION.ERROR.COURSE_NOT_FOUND
        );
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
    if (!req.body) {
      throw new Http400Error(ALERTS.NO_INFORMATION_PROVIDED);
    }

    let educationItem = req.body;
    let educationId = educationItem.education;
    const id = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error(
        educationItem.type === "book"
          ? ALERTS.EDUCATION.ERROR.BOOK_NOT_FOUND
          : ALERTS.EDUCATION.ERROR.COURSE_NOT_FOUND
      );
    }

    await removeRecommendations(req.auth, educationItem, next);

    await EducationItem.findByIdAndRemove(educationItem._id);

    const education = await Education.findById(educationId)
      .populate("educationList")
      .exec();

    if (!education) {
      throw new Http404Error(ALERTS.EDUCATION.ERROR.NOT_FOUND);
    }
    res.status(200).json({
      education,
      successMessage:
        educationItem.type === "book"
          ? ALERTS.EDUCATION.SUCCESS.BOOK.REMOVED
          : ALERTS.EDUCATION.SUCCESS.COURSE.REMOVED,
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
