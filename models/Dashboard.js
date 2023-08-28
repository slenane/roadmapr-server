const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dashboardSchema = Schema({
  // education: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Education",
  //   },
  // ],
  // profile: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Profile",
  //   },
  // ],
  // projects: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "P",
  //   },
  // ],
  // education: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Education",
  //   },
  // ],
  education: String,
  employment: String,
  projects: String,
  profile: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Dashboard", dashboardSchema);
