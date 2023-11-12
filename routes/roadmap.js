const express = require("express");
const { getRoadmap } = require("../controllers/roadmap.js");
const { isAuth } = require("../middleware/is-auth.js");

const router = express.Router();

router.get("", isAuth, getRoadmap);

module.exports = router;
