const express = require("express");
const {
  register,
  verifyEmail,
  login,
  sendResetPasswordEmail,
  verifyPasswordReset,
  resetPassword,
  isUniqueUsername,
  isUniqueEmail,
  authPage,
  getAccessToken,
  getGithubUser,
  updateGithubExistingUser,
  logout,
} = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/send-reset-password-email/:email", sendResetPasswordEmail);
router.get("/verify-reset-password", verifyPasswordReset);
router.patch("/reset-password", resetPassword);
router.get("/unique-username/:username", isUniqueUsername);
router.get("/unique-email/:email", isUniqueEmail);
router.get("/github/auth-page", authPage);
router.post("/github/get-access-token", getAccessToken);
router.get("/github/get-user-details", getGithubUser);
router.get("/github/update-existing-user/:id", updateGithubExistingUser);
router.get("/logout", logout);

module.exports = router;
