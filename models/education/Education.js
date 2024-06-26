const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const educationSchema = Schema({
  educationList: [
    {
      type: Schema.Types.ObjectId,
      ref: "EducationItem",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Education", educationSchema);
