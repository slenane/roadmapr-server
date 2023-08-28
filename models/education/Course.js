const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = Schema({
  title: String,
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  instructor: String,
  link: String,
  description: String,
  stack: [Schema.Types.Mixed],
  education: {
    type: Schema.Types.ObjectId,
    ref: "Education",
    required: true,
  },
  type: { type: String, default: "course" },
});

module.exports = mongoose.model("Course", courseSchema);
