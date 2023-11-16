const express = require("express");
const {
  getRecommendations,
  getRemoteJobs,
} = require("../controllers/recommendations.js");
const { isAuth } = require("../middleware/is-auth.js");

const router = express.Router();

router.get("", isAuth, getRecommendations);
router.get("/jobs", isAuth, getRemoteJobs);

module.exports = router;
