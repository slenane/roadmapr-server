const express = require("express");
const { getRoadmap, updateRoadmap } = require("../controllers/roadmap.js");
const { isAuth } = require("../middleware/is-auth.js");

const router = express.Router();

router.get("", isAuth, getRoadmap);
router.patch("", isAuth, updateRoadmap);

module.exports = router;
