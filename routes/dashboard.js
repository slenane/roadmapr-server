const express = require("express");
const { getDashboard } = require("../controllers/dashboard.js");
const { expressjwt: jwt } = require("express-jwt");

const isAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("", isAuth, getDashboard);

module.exports = router;
