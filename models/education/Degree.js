const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const degreeSchema = Schema({
  title: String,
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  link: String,
  description: String,
  institution: String,
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
  type: { type: String, default: "degree" },
});

module.exports = mongoose.model("Degree", degreeSchema);
