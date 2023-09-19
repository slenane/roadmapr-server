const express = require("express");
const {
  getEducation,
  createEducationItem,
  updateEducationItem,
  deleteEducationItem,
  bulkUpdateEducationItems,
  // getItemDetails,
} = require("../controllers/education.js");
const { expressjwt: jwt } = require("express-jwt");

const isAuth = jwt({
  secret: process.env.DB_SECRET,
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("", isAuth, getEducation);
router.get("/:id", isAuth, getEducation);
// router.post("/get-details", getItemDetails);
router.post("/:id", isAuth, createEducationItem);
router.patch("/edit/:id", isAuth, updateEducationItem);
router.patch("/bulk-edit/:id", isAuth, bulkUpdateEducationItems);
router.post("/remove/:id", isAuth, deleteEducationItem);

module.exports = router;
