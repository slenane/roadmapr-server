const express = require("express");
const {
  register,
  verifyEmail,
  login,
  isUniqueUsername,
  isUniqueEmail,
  authPage,
  getAccessToken,
  getGithubUser,
  logout,
} = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/unique-username/:username", isUniqueUsername);
router.get("/unique-email/:email", isUniqueEmail);
router.get("/github/auth-page", authPage);
router.post("/github/get-access-token", getAccessToken);
router.get("/github/get-user-details", getGithubUser);
router.get("/github/get-user-details/:id", getGithubUser);
router.get("/logout", logout);

module.exports = router;
