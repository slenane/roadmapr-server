const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roadmapSchema = new Schema({
  path: {
    id: Number,
    name: String,
  },
  stack: {
    id: Number,
    name: String,
  },
  education: String,
  experience: String,
  projects: String,
  github: {
    lastUpdated: Date,
    avatar: String,
    name: String,
    bio: String,
    url: String,
    link: String,
    login: String,
    publicRepos: Number,
    privateRepos: Number,
    followers: Number,
    following: Number,
    reposUrl: String,
    featuredRepo: {
      createdAt: String,
      updatedAt: String,
      link: String,
      name: String,
      description: String,
      languages: Object,
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
