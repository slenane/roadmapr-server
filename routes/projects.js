const express = require("express");
const {
  getProjects,
  createProjectItem,
  updateProjectItem,
  bulkUpdateProjectItems,
  deleteProjectItem,
} = require("../controllers/projects.js");
const { isAuth } = require("../middleware/is-auth.js");
const { getProjectsRules, sanitize } = require("../middleware/sanitize.js");

const router = express.Router();

router.get("", isAuth, getProjects);
router.get("/:id", isAuth, getProjects);
router.post("/:id", isAuth, getProjectsRules(), sanitize, createProjectItem);
router.patch(
  "/edit/:id",
  isAuth,
  getProjectsRules(),
  sanitize,
  updateProjectItem
);
router.patch("/bulk-edit/:id", isAuth, bulkUpdateProjectItems);
router.post("/remove/:id", isAuth, deleteProjectItem);

module.exports = router;
