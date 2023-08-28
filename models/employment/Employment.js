const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employmentSchema = Schema({
  employmentList: [
    {
      type: Schema.Types.ObjectId,
      ref: "EmploymentItem",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Employment", employmentSchema);
