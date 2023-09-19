const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile.js");
const { expressjwt: jwt } = require("express-jwt");

const isAuth = jwt({
  secret: process.env.DB_SECRET,
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("", isAuth, getProfile);
router.patch("/:id", isAuth, updateProfile);

module.exports = router;
