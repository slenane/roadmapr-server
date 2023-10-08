const mongoose = require("mongoose");
const User = require("../models/User.js");

const getProfile = async (req, res) => {
  try {
    User.findById(req.auth._id, (err, user) => {
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  let data = req.body.data;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No item with that id");
  }

  try {
    const user = await User.findByIdAndUpdate(id, { ...data }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { profileImage: req.file.location },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, updateProfileImage };
