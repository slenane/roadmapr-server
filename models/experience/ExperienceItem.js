const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const experienceItemSchema = Schema({
  company: String,
  companyLink: String,
  description: String,
  endDate: Date,
  github: String,
  project: String,
  role: String,
  stack: Array,
  pinned: Boolean,
  status: "inProgress" | "done",
  position: Number,
  startDate: Date,
  type: String,
  experience: {
    type: Schema.Types.ObjectId,
    ref: "Experience",
    required: true,
  },
});

module.exports = mongoose.model("ExperienceItem", experienceItemSchema);
