const mongoose = require("mongoose");
const User = require("../models/User.js");
const Http404Error = require("../utils/errorHandling/http404Error.js");
const Http400Error = require("../utils/errorHandling/http400Error.js");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user) {
      throw new Http404Error("ALERTS.AUTH.ERROR.USER_NOT_FOUND");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (!req.body.data) {
      throw new Http400Error("No information was provided");
    }

    const data = req.body.data;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Http404Error("ALERTS.AUTH.ERROR.USER_NOT_FOUND");
    }

    const user = await User.findByIdAndUpdate(id, { ...data }, { new: true });

    if (!user) {
      throw new Http404Error("ALERTS.AUTH.ERROR.USER_NOT_FOUND");
    }

    res.status(200).json({ user, successMessage: "Profile Updated" });
  } catch (error) {
    next(error);
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Http400Error("No file was provided");
    }

    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { profileImage: req.file.location },
      { new: true }
    );

    if (!user) {
      throw new Http404Error("ALERTS.AUTH.ERROR.USER_NOT_FOUND");
    }

    res.status(200).json({ user, successMessage: "Profile Image Updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updateProfileImage };
