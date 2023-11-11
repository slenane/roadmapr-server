const express = require("express");
const {
  getEmployment,
  createEmploymentItem,
  updateEmploymentItem,
  bulkUpdateEmploymentItems,
  deleteEmploymentItem,
} = require("../controllers/employment.js");
const { isAuth } = require("../middleware/is-auth.js");
const { getEmploymentRules, sanitize } = require("../middleware/sanitize.js");

const router = express.Router();

router.get("", isAuth, getEmployment);
router.get("/:id", isAuth, getEmployment);
router.post(
  "/:id",
  isAuth,
  getEmploymentRules(),
  sanitize,
  createEmploymentItem
);
router.patch(
  "/edit/:id",
  getEmploymentRules(),
  sanitize,
  isAuth,
  updateEmploymentItem
);
router.patch("/bulk-edit/:id", isAuth, bulkUpdateEmploymentItems);
router.post("/remove/:id", isAuth, deleteEmploymentItem);

module.exports = router;
