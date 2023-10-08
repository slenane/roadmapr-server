const express = require("express");
const {
  getProfile,
  updateProfile,
  updateProfileImage,
} = require("../controllers/profile.js");
const { expressjwt: jwt } = require("express-jwt");
const upload = require("../multerConfig.js");

const isAuth = jwt({
  secret: process.env.DB_SECRET,
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("", isAuth, getProfile);
router.patch("/:id", isAuth, updateProfile);
router.post(
  "/image-upload",
  isAuth,
  upload.single("profileImage"),
  updateProfileImage
);

module.exports = router;
