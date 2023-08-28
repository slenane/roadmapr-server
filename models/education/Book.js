const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = Schema({
  title: String,
  author: String,
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  link: String,
  description: String,
  stack: [Schema.Types.Mixed],
  education: {
    type: Schema.Types.ObjectId,
    ref: "Education",
    required: true,
  },
  type: { type: String, default: "book" },
});

module.exports = mongoose.model("Book", bookSchema);
