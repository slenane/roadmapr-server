const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recommendationSchema = new Schema({
  internal: {
    provider: { type: String, required: true },
    title: { type: String, required: true },
  },
  author: String,
  title: String,
  isbn: { type: String, required: false },
  count: { type: Number, required: true },
  recommended: { type: Number, required: true },
  paths: {
    type: Object,
    default: {},
  },
  locations: {
    type: Object,
    default: {},
  },
  nationalities: {
    type: Object,
    default: {},
  },
  stack: [Schema.Types.Mixed],
  description: "",
  link: String,
  type: String,
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
