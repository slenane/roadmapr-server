const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const educationSchema = Schema({
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  tutorials: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tutorial",
    },
  ],
  degrees: [
    {
      type: Schema.Types.ObjectId,
      ref: "Degree",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Education", educationSchema);
