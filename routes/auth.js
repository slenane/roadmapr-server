const express = require("express");
const {
  getRegistrationRules,
  getResendRegistrationEmailRules,
  getLoginRules,
  getResetPasswordRules,
  sanitize,
} = require("../middleware/sanitize.js");
const {
  register,
  resendRegisterEmail,
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

router.post("/register", getRegistrationRules(), sanitize, register);
router.post(
  "/register-resend-email",
  getResendRegistrationEmailRules(),
  sanitize,
  resendRegisterEmail
);
router.get("/verify-email", verifyEmail);
router.post("/login", getLoginRules(), sanitize, login);
router.get("/send-reset-password-email/:email", sendResetPasswordEmail);
router.get("/verify-reset-password", verifyPasswordReset);
router.patch(
  "/reset-password",
  getResetPasswordRules(),
  sanitize,
  resetPassword
);
router.get("/unique-username/:username", isUniqueUsername);
router.get("/unique-email/:email", isUniqueEmail);
router.get("/github/auth-page", authPage);
router.post("/github/get-access-token", getAccessToken);
router.get("/github/get-user-details", getGithubUser);
router.get("/github/update-existing-user/:id", updateGithubExistingUser);
router.get("/logout", logout);

module.exports = router;
