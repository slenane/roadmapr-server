const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employmentItemSchema = Schema({
  company: String,
  companyLink: String,
  description: String,
  endDate: Date,
  github: String,
  project: String,
  role: String,
  stack: Array,
  startDate: Date,
  type: String,
  employment: String,
});

module.exports = mongoose.model("EmploymentItem", employmentItemSchema);
