const express = require("express");
const {
  getProfile,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
} = require("../controllers/profile.js");
const { isAuth } = require("../middleware/is-auth.js");
const upload = require("../multerConfig.js");

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
