const express = require("express");
const { getRecommendations } = require("../controllers/recommendations.js");
const { isAuth } = require("../middleware/is-auth.js");

const router = express.Router();

router.get("", isAuth, getRecommendations);

module.exports = router;
