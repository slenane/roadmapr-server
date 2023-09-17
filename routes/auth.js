const express = require("express");
const {
  register,
  login,
  authPage,
  getAccessToken,
  getUserDetails,
  logout,
} = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth-page", authPage);
router.post("/get-access-token", getAccessToken);
router.get("/get-user-details", getUserDetails);
router.get("/logout", logout);

module.exports = router;
