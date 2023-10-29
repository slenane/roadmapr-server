const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const educationItemSchema = Schema({
  title: String,
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  isRecommended: { type: Boolean, default: true },
  author: String,
  provider: String,
  link: String,
  description: String,
  github: String,
  stack: [Schema.Types.Mixed],
  pinned: Boolean,
  status: "todo" | "inProgress" | "done",
  position: Number,
  type: String,
  metadata: {
    provider: String,
    title: String,
    isbn: String,
  },
  education: {
    type: Schema.Types.ObjectId,
    ref: "Education",
    required: true,
  },
});

module.exports = mongoose.model("EducationItem", educationItemSchema);
