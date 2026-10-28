const mongoose = require("mongoose");
const { Requirement } = require("../models/Requirement");
const { sanitizeRequirement } = require("../utils/validateRequirement");

async function createRequirement(req, res, next) {
  try {
    const payload = sanitizeRequirement(req.body);
    const requirement = await Requirement.create(payload);

    res.status(201).json({
      success: true,
      message: "Requirement submitted successfully.",
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
}

async function getRequirementById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const error = new Error("Invalid requirement id.");
      error.statusCode = 400;
      throw error;
    }

    const requirement = await Requirement.findById(req.params.id);

    if (!requirement) {
      const error = new Error("Requirement not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: requirement,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createRequirement, getRequirementById };
