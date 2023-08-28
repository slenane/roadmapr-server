const mongoose = require("mongoose");
const User = require("../models/User.js");

const getSettings = async (req, res) => {
  try {
    User.findById(req.auth._id, (err, settings) => {
      res.status(200).json({
        username: settings.username,
        email: settings.email,
        theme: settings.theme,
        notifications: settings.notifications,
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
      username: settings.username,
      email: settings.email,
      theme: settings.theme,
      notifications: settings.notifications,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
