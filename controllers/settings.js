const mongoose = require("mongoose");
const User = require("../models/User.js");

const getSettings = async (req, res) => {
  try {
    User.findById(req.auth._id, (err, user) => {
      res.status(200).json({
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        theme: user.theme,
        notifications: user.notifications,
        preferredLanguage: user.preferredLanguage,
      });
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  let data = req.body.data;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No item with that id");
  }

  try {
    const settings = await User.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );
    res.status(200).json({
      userId: settings._id,
      name: settings.name,
      username: settings.username,
      email: settings.email,
      theme: settings.theme,
      notifications: settings.notifications,
      preferredLanguage: settings.preferredLanguage,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    User.findById(req.auth._id, async (err, user) => {
      if (req.body.password) {
        await user.setPassword(req.body.password);
        await user.save();
      }

      res.status(200).json({
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        theme: user.theme,
        notifications: user.notifications,
        preferredLanguage: user.preferredLanguage,
      });
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings, updatePassword };
