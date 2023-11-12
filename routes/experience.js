const express = require("express");
const {
  getExperience,
  createExperienceItem,
  updateExperienceItem,
  bulkUpdateExperienceItems,
  deleteExperienceItem,
} = require("../controllers/experience.js");
const { isAuth } = require("../middleware/is-auth.js");
const { getExperienceRules, sanitize } = require("../middleware/sanitize.js");

const router = express.Router();

router.get("", isAuth, getExperience);
router.get("/:id", isAuth, getExperience);
router.post(
  "/:id",
  isAuth,
  getExperienceRules(),
  sanitize,
  createExperienceItem
);
router.patch(
  "/edit/:id",
  getExperienceRules(),
  sanitize,
  isAuth,
  updateExperienceItem
);
router.patch("/bulk-edit/:id", isAuth, bulkUpdateExperienceItems);
router.post("/remove/:id", isAuth, deleteExperienceItem);

module.exports = router;
