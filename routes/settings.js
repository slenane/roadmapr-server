const express = require("express");
const {
  getSettings,
  updateSettings,
  updatePassword,
  deleteAccount,
} = require("../controllers/settings.js");
const { expressjwt: jwt } = require("express-jwt");

const isAuth = jwt({
  secret: process.env.DB_SECRET,
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("", isAuth, getSettings);
router.patch("/edit/:id", isAuth, updateSettings);
router.patch("/update-password/:id", isAuth, updatePassword);
router.get("/delete-account", isAuth, deleteAccount);

module.exports = router;
