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
  pinned: Boolean,
  status: "todo" | "inProgress" | "done",
  position: Number,
  startDate: Date,
  type: String,
  employment: {
    type: Schema.Types.ObjectId,
    ref: "Employment",
    required: true,
  },
});

module.exports = mongoose.model("EmploymentItem", employmentItemSchema);
