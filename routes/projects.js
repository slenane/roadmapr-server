const express = require("express");
const {
  getProjects,
  createProjectItem,
  updateProjectItem,
  deleteProjectItem,
} = require("../controllers/projects.js");
const { expressjwt: jwt } = require("express-jwt");

const isAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("", isAuth, getProjects);
router.get("/:id", isAuth, getProjects);
router.post("/:id", isAuth, createProjectItem);
router.patch("/edit/:id", isAuth, updateProjectItem);
router.post("/remove/:id", isAuth, deleteProjectItem);

module.exports = router;
