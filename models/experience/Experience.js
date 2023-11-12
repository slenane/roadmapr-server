const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienceSchema = Schema({
  experienceList: [
    {
      type: Schema.Types.ObjectId,
      ref: "ExperienceItem",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Experience", experienceSchema);
