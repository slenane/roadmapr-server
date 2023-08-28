const mongoose = require("mongoose");
const Education = require("../models/education/Education.js");
const Course = require("../models/education/Course.js");
const Book = require("../models/education/Book.js");
const Degree = require("../models/education/Degree.js");
const Tutorial = require("../models/education/Tutorial.js");
// const fetchEducationItem = require("../utils/fetchEducationItem.js");

const getEducation = (req, res) => {
  try {
    Education.find({ user: req.auth._id })
      .populate(["books", "courses", "degrees", "tutorials"])
      .exec((err, education) => {
        if (err) {
          education = new Education({ user: req.auth._id });
          education.save();
        }

        res.status(200).json(education[0]);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createEducationItem = async (req, res) => {
  if (!req.body.data) return;

  let educationItem = req.body.data;
  educationItem.education = req.params.id;
  const type = educationItem.type + "s";

  switch (educationItem.type) {
    case "book":
      educationItem = new Book(educationItem);
      break;
    case "course":
      educationItem = new Course(educationItem);
      break;
    case "degree":
      educationItem = new Degree(educationItem);
      break;
    case "tutorial":
      educationItem = new Tutorial(educationItem);
      break;
  }

  try {
    await educationItem.save();

    Education.findById(educationItem.education)
      .populate(["books", "courses", "degrees", "tutorials"])
      .exec((err, education) => {
        education[type].push(educationItem);
        education.save();

        res.status(200).json(education);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateEducationItem = async (req, res) => {
  if (!req.body.data) return;

  let educationItem = req.body.data;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No item with that id");

  if (educationItem.type === "book") {
    educationItem = await Book.findByIdAndUpdate(
      id,
      { ...educationItem, id },
      { new: true }
    );
  } else if (educationItem.type === "course") {
    educationItem = await Course.findByIdAndUpdate(
      id,
      { ...educationItem, id },
      { new: true }
    );
  } else if (educationItem.type === "degree") {
    educationItem = await Degree.findByIdAndUpdate(
      id,
      { ...educationItem, id },
      { new: true }
    );
  } else if (educationItem.type === "tutorial") {
    educationItem = await Tutorial.findByIdAndUpdate(
      id,
      { ...educationItem, id },
      { new: true }
    );
  }

  try {
    Education.findById(educationItem.education)
      .populate(["books", "courses", "degrees", "tutorials"])
      .exec((err, education) => {
        res.status(201).json(education);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteEducationItem = async (req, res) => {
  if (!req.body.data) return;

  let educationItem = req.body.data;
  let educationId = educationItem.education;
  const id = req.body.data._id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No item with that id");

  if (educationItem.type === "book") {
    await Book.findByIdAndRemove(educationItem._id);
  } else if (educationItem.type === "course") {
    await Course.findByIdAndRemove(educationItem._id);
  } else if (educationItem.type === "degree") {
    await Degree.findByIdAndRemove(educationItem._id);
  } else if (educationItem.type === "tutorial") {
    await Tutorial.findByIdAndRemove(educationItem._id);
  }

  try {
    Education.findById(educationId)
      .populate(["books", "courses", "degrees", "tutorials"])
      .exec((err, education) => {
        res.status(200).json(education);
      });
  } catch (error) {
    res.status(404).json({ message: error.message });
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
  // getItemDetails,
};
