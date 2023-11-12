const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roadmapSchema = new Schema({
  plan: [Schema.Types.Mixed],
  education: String,
  experience: String,
  projects: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
