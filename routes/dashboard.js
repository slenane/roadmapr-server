const express = require("express");
const { getDashboard } = require("../controllers/dashboard.js");
const { isAuth } = require("../middleware/is-auth.js");

const router = express.Router();

router.get("", isAuth, getDashboard);

module.exports = router;
