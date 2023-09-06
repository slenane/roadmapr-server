const express = require("express");
const {
  getEmployment,
  createEmploymentItem,
  updateEmploymentItem,
  bulkUpdateEmploymentItems,
  deleteEmploymentItem,
} = require("../controllers/employment.js");
const { expressjwt: jwt } = require("express-jwt");

const isAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("", isAuth, getEmployment);
router.get("/:id", isAuth, getEmployment);
router.post("/:id", isAuth, createEmploymentItem);
router.patch("/edit/:id", isAuth, updateEmploymentItem);
router.patch("/bulk-edit/:id", isAuth, bulkUpdateEmploymentItems);
router.post("/remove/:id", isAuth, deleteEmploymentItem);

module.exports = router;
