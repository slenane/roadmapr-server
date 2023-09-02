const mongoose = require("mongoose");
const Education = require("../models/education/Education.js");
const EducationItem = require("../models/education/EducationItem.js");
// const fetchEducationItem = require("../utils/fetchEducationItem.js");

const getEducation = (req, res) => {
  try {
    Education.find({ user: req.auth._id })
      .populate("items")
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

  const educationItem = new EducationItem({
    ...req.body.data,
    education: req.params.id,
  });

  try {
    await educationItem.save();

    Education.findById(educationItem.education)
      .populate("items")
      .exec((err, education) => {
        education["items"].push(educationItem);
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

  educationItem = await EducationItem.findByIdAndUpdate(
    id,
    { ...educationItem, id },
    { new: true }
  );

  try {
    Education.findById(educationItem.education)
      .populate("items")
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

  await EducationItem.findByIdAndRemove(educationItem._id);

  try {
    Education.findById(educationId)
      .populate("items")
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
