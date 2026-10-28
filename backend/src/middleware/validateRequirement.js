const { validateRequirementPayload } = require("../utils/validateRequirement");

function validateCreateRequirement(req, res, next) {
  const { errors } = validateRequirementPayload(req.body);

  if (errors.length > 0) {
    const error = new Error("Validation failed.");
    error.statusCode = 400;
    error.errors = errors;
    next(error);
    return;
  }

  next();
}

function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    const error = new Error("Invalid requirement id.");
    error.statusCode = 400;
    next(error);
    return;
  }
  next();
}

module.exports = { validateCreateRequirement, validateObjectId };
