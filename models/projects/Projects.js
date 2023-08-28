const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectsSchema = Schema({
  projectList: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProjectItem",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Projects", projectsSchema);
