const express = require("express");
const { createRequirement, getRequirementById } = require("../controllers/requirementController");
const { validateCreateRequirement, validateObjectId } = require("../middleware/validateRequirement");

const router = express.Router();

router.post("/", validateCreateRequirement, createRequirement);
router.get("/:id", validateObjectId, getRequirementById);

module.exports = router;
