const mongoose = require("mongoose");
const Recommendation = require("../models/recommendations/Recommendation.js");
const Education = require("../models/education/Education.js");
const User = require("../models/User.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const {
  getUpdatedRemoteJobs,
} = require("../utils/recommendations/remoteJobs.js");

const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    if (!user) return;

    const path = user.path.name;
    const location = user.location.id;
    const nationality = user.nationality.id;
    const education = await Education.findOne({ user: user._id })
      .populate("educationList")
      .exec();
    const educationMetadata = education.educationList.map(
      (item) => item?.metadata
    );

    let recommendations = await Recommendation.find({
      $or: [
        { path: { $regex: new RegExp(path, "i") } },
        { location: { $regex: new RegExp(location, "i") } },
        { nationality: { $regex: new RegExp(nationality, "i") } },
      ],
    });

    const userRecommendations = recommendations
      .filter((recommendation) => {
        return !educationMetadata.find((item) => {
          return (
            item.provider === recommendation.internal.provider &&
            item.title === recommendation.internal.title
          );
        });
      })
      .filter((recommendation) => {
        return (
          !!recommendation.title &&
          !!recommendation.author &&
          (recommendation.recommended / recommendation.count) * 100 >= 90
        );
      })
      .sort((a, b) => {
        const matchesA = [a.path, a.location, a.nationality].filter(
          Boolean
        ).length;
        const matchesB = [b.path, b.location, b.nationality].filter(
          Boolean
        ).length;

        return matchesB - matchesA;
      })
      .splice(0, 3);

    res.status(200).json(userRecommendations);
  } catch (error) {
    next(error);
  }
};

const getRemoteJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);
    const remoteJobs = await getUpdatedRemoteJobs(user.path.name);
    res.status(200).json(remoteJobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  getRemoteJobs,
};
