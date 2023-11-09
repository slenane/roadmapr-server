const express = require("express");
const {
  getEducation,
  createEducationItem,
  updateEducationItem,
  deleteEducationItem,
  bulkUpdateEducationItems,
  // getItemDetails,
} = require("../controllers/education.js");
const { isAuth } = require("../middleware/is-auth.js");
const { getEducationRules, sanitize } = require("../middleware/sanitize.js");

const router = express.Router();

router.get("", isAuth, getEducation);
router.get("/:id", isAuth, getEducation);
// router.post("/get-details", getItemDetails);
router.post("/:id", isAuth, getEducationRules(), sanitize, createEducationItem);
router.patch(
  "/edit/:id",
  isAuth,
  getEducationRules(),
  sanitize,
  updateEducationItem
);
router.patch("/bulk-edit/:id", isAuth, bulkUpdateEducationItems);
router.post("/remove/:id", isAuth, deleteEducationItem);

module.exports = router;
