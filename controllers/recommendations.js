const mongoose = require("mongoose");
const Recommendation = require("../models/Recommendation.js");
const Education = require("../models/education/Education.js");
const EducationItem = require("../models/education/EducationItem.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const {
  generateEducationItemMetadata,
  hasMetadata,
  metadataUpdateRequired,
} = require("../utils/educationMetadata.js");

const incrementCount = (value) => {
  return value ? value + 1 : 1;
};

const getRecommendations = async (req, res, next) => {
  try {
    const user = req.auth;
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

const updateRecommendations = async (
  user,
  educationItem,
  originalMetadata,
  next
) => {
  if (hasMetadata(educationItem?.metadata)) {
    educationItem.metadata = generateEducationItemMetadata(educationItem.link);

    if (metadataUpdateRequired(originalMetadata, educationItem.metadata)) {
      await removeRecommendation(
        user,
        originalMetadata,
        educationItem.isRecommended,
        next
      );
      await updateRecommendation(user, educationItem, next);
    }
  } else {
    educationItem.metadata = await generateEducationItemMetadata(
      educationItem.link
    );

    if (hasMetadata(educationItem?.metadata)) {
      await updateRecommendation(user, educationItem, next);
    }
  }
  return educationItem.metadata;
};

const removeRecommendations = async (user, educationItem, next) => {
  if (hasMetadata(educationItem?.metadata)) {
    await removeRecommendation(
      user,
      educationItem.metadata,
      educationItem.isRecommended,
      next
    );
  }
};

const updateRecommendation = async (user, item, next) => {
  try {
    if (
      !item.metadata.provider ||
      !item.metadata.title ||
      (item.metadata.provider === "amazon" && !item.metadata.isbn)
    ) {
      return;
    }

    let recommendation = await Recommendation.findOne({
      "internal.provider": item.metadata.provider,
      "internal.title": item.metadata.title,
    });

    if (!recommendation) {
      recommendation = new Recommendation({
        internal: {
          provider: item.metadata.provider,
          title: item.metadata.title,
        },
        author: "",
        title: "",
        type: item.metadata.provider === "amazon" ? "book" : "course",
        ...(item.stack ? { stack: item.stack } : {}),
        ...(item.metadata.isbn ? { isbn: item.metadata.isbn } : {}),
        count: 0,
        recommended: 0,
        paths: {},
        nationalities: {},
        locations: {},
        description: "",
        link: item.link,
      });
    }

    recommendation.count++;
    if (item.isRecommended) recommendation.recommended++;

    const path = user.path.name;
    const nationalityId = user.nationality.id;
    const locationId = user.location.id;

    recommendation.markModified("paths");
    recommendation.markModified("nationalities");
    recommendation.markModified("locations");

    recommendation.paths[path] = incrementCount(recommendation.paths[path]);
    recommendation.nationalities[nationalityId] = incrementCount(
      recommendation.nationalities[nationalityId]
    );
    recommendation.locations[locationId] = incrementCount(
      recommendation.locations[locationId]
    );

    await recommendation.save();
  } catch (error) {
    next(error);
  }
};

const removeRecommendation = async (user, data, isRecommended, next) => {
  try {
    if (
      !data.provider ||
      !data.title ||
      (data.provider === "amazon" && !data.isbn) ||
      !user
    ) {
      return;
    }

    const recommendation = await Recommendation.findOne({
      "internal.provider": data.provider,
      "internal.title": data.title,
    });

    if (!recommendation) return;

    recommendation.count--;

    if (recommendation.count < 1) {
      const removed = await recommendation.remove();
      if (!removed) {
        throw new Http400Error("Recommendation not removed");
      }
      return;
    }

    if (isRecommended) recommendation.recommended--;

    const pathId = user.path.id;
    const nationalityId = user.nationality.id;
    const locationId = user.location.id;

    recommendation.markModified("paths");
    recommendation.markModified("nationalities");
    recommendation.markModified("locations");

    recommendation.paths[pathId]--;
    recommendation.nationalities[nationalityId]--;
    recommendation.locations[locationId]--;

    if (recommendation.paths[pathId] < 1) delete recommendation.paths[pathId];
    if (recommendation.nationalities[nationalityId] < 1)
      delete recommendation.nationalities[nationalityId];
    if (recommendation.locations[locationId] < 1)
      delete recommendation.locations[locationId];

    await recommendation.save();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  updateRecommendations,
  removeRecommendations,
};
