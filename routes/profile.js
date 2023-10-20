const express = require("express");
const {
  getProfile,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
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
  "/profile-image-upload",
  isAuth,
  upload.single("profileImage"),
  updateProfileImage
);
router.post(
  "/cover-image-upload",
  isAuth,
  upload.single("coverImage"),
  updateCoverImage
);

module.exports = router;
