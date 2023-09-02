const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tutorialSchema = Schema({
  title: String,
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  instructor: String,
  link: String,
  github: String,
  description: String,
  stack: [Schema.Types.Mixed],
  education: {
    type: Schema.Types.ObjectId,
    ref: "Education",
    required: true,
  },
  pin: {
    pinned: Boolean,
    position: Number,
  },
  type: { type: String, default: "tutorial" },
});

module.exports = mongoose.model("Tutorial", tutorialSchema);
