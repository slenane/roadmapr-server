const express = require("express");
const {
  getSettings,
  updateSettings,
  removeGithub,
  updateEmail,
  verifyEmailUpdate,
  updatePassword,
  updateExistingPassword,
  deleteAccount,
} = require("../controllers/settings.js");
const { isAuth } = require("../middleware/is-auth.js");
const {
  getSettingsRules,
  getEmailRules,
  getPasswordRules,
  getExistingPasswordRules,
  sanitize,
} = require("../middleware/sanitize.js");

const router = express.Router();

router.get("", isAuth, getSettings);
router.patch("/edit/:id", isAuth, getSettingsRules(), sanitize, updateSettings);
router.patch("/remove-github/:id", isAuth, removeGithub);
router.patch(
  "/update-email/:id",
  isAuth,
  getEmailRules(),
  sanitize,
  updateEmail
);
router.get("/verify-email-update", verifyEmailUpdate);
router.patch(
  "/update-password/:id",
  isAuth,
  getPasswordRules(),
  sanitize,
  updatePassword
);
router.patch(
  "/update-existing-password/:id",
  isAuth,
  getExistingPasswordRules(),
  sanitize,
  updateExistingPassword
);
router.get("/delete-account", isAuth, deleteAccount);

module.exports = router;
