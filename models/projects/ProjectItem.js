const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectItemSchema = Schema({
  description: String,
  endDate: Date,
  github: String,
  link: String,
  notes: String,
  stack: Array,
  startDate: Date,
  title: String,
  tagLine: String,
  pinned: Boolean,
  status: "todo" | "inProgress" | "done",
  position: Number,
  type: String,
  projects: {
    type: Schema.Types.ObjectId,
    ref: "Projects",
    required: true,
  },
});

module.exports = mongoose.model("ProjectItem", projectItemSchema);
