const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const educationItemSchema = Schema({
  title: String,
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  author: String,
  provider: String,
  link: String,
  description: String,
  github: String,
  stack: [Schema.Types.Mixed],
  pinned_position: Number,
  type: String,
  education: {
    type: Schema.Types.ObjectId,
    ref: "Education",
    required: true,
  },
});

module.exports = mongoose.model("EducationItem", educationItemSchema);
