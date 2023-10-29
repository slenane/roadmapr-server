const mongoose = require("mongoose");
const Recommendation = require("../models/Recommendation.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");

const incrementCount = (value) => {
  return value ? value + 1 : 1;
};

const updateEducationRecommendation = async (
  user,
  data,
  isRecommended,
  next
) => {
  try {
    if (
      !data.provider ||
      !data.title ||
      (data.provider === "amazon" && !data.isbn) ||
      !user
    ) {
      return;
    }

    let recommendation = await Recommendation.findOne({
      provider: data.provider,
      title: data.title,
    });

    if (!recommendation) {
      recommendation = new Recommendation({
        provider: data.provider,
        title: data.title,
        ...(data.isbn ? { isbn: data.isbn } : {}),
        count: 0,
        recommended: 0,
        paths: {},
        nationalities: {},
        locations: {},
      });
    }

    recommendation.count++;
    if (isRecommended) recommendation.recommended++;

    const pathId = user.path.id;
    const nationalityId = user.nationality.id;
    const locationId = user.location.id;

    recommendation.markModified("paths");
    recommendation.markModified("nationalities");
    recommendation.markModified("locations");

    recommendation.paths[pathId] = incrementCount(recommendation.paths[pathId]);
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

const removeEducationRecommendation = async (
  user,
  data,
  isRecommended,
  next
) => {
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
      provider: data.provider,
      title: data.title,
    });

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
  updateEducationRecommendation,
  removeEducationRecommendation,
};
