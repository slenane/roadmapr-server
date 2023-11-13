const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const remoteJobSchema = new Schema({
  position: String,
  company: String,
  companyLogo: String,
  date: Date,
  tags: [Schema.Types.Mixed],
  description: String,
  stack: [Schema.Types.Mixed],
  url: String,
  applyUrl: String,
  lastUpdate: Date,
});

module.exports = mongoose.model("RemoteJob", remoteJobSchema);
