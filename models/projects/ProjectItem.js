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
  todo: String,
  projects: String,
});

module.exports = mongoose.model("ProjectItem", projectItemSchema);
