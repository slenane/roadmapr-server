const mongoose = require("mongoose");
const Recommendation = require("../models/Recommendation.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");
const {
  generateEducationItemMetadata,
  hasMetadata,
  metadataUpdateRequired,
} = require("../utils/educationMetadata.js");

const incrementCount = (value) => {
  return value ? value + 1 : 1;
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
      await updateRecommendation(
        user,
        educationItem.metadata,
        educationItem.isRecommended,
        next
      );
    }
  } else {
    educationItem.metadata = await generateEducationItemMetadata(
      educationItem.link
    );

    if (hasMetadata(educationItem?.metadata)) {
      await updateRecommendation(
        user,
        educationItem.metadata,
        educationItem.isRecommended,
        next
      );
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

const updateRecommendation = async (user, data, isRecommended, next) => {
  try {
    if (
      !data.provider ||
      !data.title ||
      (data.provider === "amazon" && !data.isbn)
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
      provider: data.provider,
      title: data.title,
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
  updateRecommendations,
  removeRecommendations,
};
