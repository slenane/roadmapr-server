const express = require("express");
const {
  register,
  login,
  isUniqueUsername,
  isUniqueEmail,
  authPage,
  getAccessToken,
  getUserDetails,
  logout,
} = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/unique-username/:username", isUniqueUsername);
router.get("/unique-email/:email", isUniqueEmail);
router.get("/github/auth-page", authPage);
router.post("/github/get-access-token", getAccessToken);
router.get("/github/get-user-details", getUserDetails);
// router.get("/github/get-user-details/:id", getUserDetails);
router.get("/logout", logout);

module.exports = router;
