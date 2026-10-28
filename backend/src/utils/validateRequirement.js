const { CATEGORIES } = require("../models/Requirement");

const EVENT_TYPES = [
  "Wedding",
  "Corporate",
  "Concert",
  "Birthday",
  "Festival",
  "Conference",
  "Private Party",
  "Other",
];

const PLANNER_SERVICES = [
  "Venue booking",
  "Decor",
  "Catering",
  "Logistics",
  "Guest management",
  "Full event management",
];

const PERFORMER_TYPES = ["Singer", "DJ", "Band", "Dancer", "Magician", "Comedian", "Other"];
const GENRES = ["Pop", "Rock", "Classical", "Bollywood", "Jazz", "Hip-hop", "Folk", "Other"];
const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi", "Other"];
const CREW_ROLES = [
  "Lighting",
  "Sound",
  "Photography",
  "Videography",
  "Stage management",
  "Security",
  "Catering staff",
  "Other",
];
const EXPERIENCE_LEVELS = ["Entry-level", "1-3 years", "3-5 years", "5+ years"];
const EQUIPMENT_OPTIONS = ["Need full setup", "Partial setup needed", "Self-equipped", "To be discussed"];
const SHIFT_OPTIONS = ["4 hours", "6 hours", "8 hours", "12 hours", "Full event duration"];
const PAYMENT_RANGES = ["Under Rs 10000", "Rs 10000-25000", "Rs 25000-50000", "Rs 50000-100000", "Above Rs 100000"];

function isNonEmptyString(value, min = 1, max = 500) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

function isIntegerInRange(value, min, max) {
  return Number.isInteger(value) && value >= min && value <= max;
}

function isValidDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function addError(errors, field, message) {
  errors.push({ field, message });
}

function validateCommonFields(body, errors) {
  if (!isNonEmptyString(body.eventName, 3, 120)) {
    addError(errors, "eventName", "Event name must be between 3 and 120 characters.");
  }

  if (!EVENT_TYPES.includes(body.eventType)) {
    addError(errors, "eventType", "Select a valid event type.");
  }

  if (!isValidDateString(body.startDate)) {
    addError(errors, "startDate", "Start date must be a valid YYYY-MM-DD date.");
  }

  if (!isValidDateString(body.endDate)) {
    addError(errors, "endDate", "End date must be a valid YYYY-MM-DD date.");
  }

  if (isValidDateString(body.startDate) && isValidDateString(body.endDate) && body.endDate < body.startDate) {
    addError(errors, "endDate", "End date cannot be earlier than the start date.");
  }

  if (!isNonEmptyString(body.location, 2, 160)) {
    addError(errors, "location", "Location must be between 2 and 160 characters.");
  }

  if (body.venue !== undefined && body.venue !== null && body.venue !== "") {
    if (!isNonEmptyString(body.venue, 1, 160)) {
      addError(errors, "venue", "Venue must be 160 characters or fewer.");
    }
  }

  if (!CATEGORIES.includes(body.category)) {
    addError(errors, "category", "Category must be planner, performer, or crew.");
  }
}

function validateStringArray(values, allowed, field, label, errors) {
  if (!Array.isArray(values) || values.length === 0) {
    addError(errors, field, `Select at least one ${label}.`);
    return;
  }

  if (values.some((item) => !allowed.includes(item))) {
    addError(errors, field, `One or more selected ${label}s are invalid.`);
  }
}

function validatePlannerDetails(details, errors) {
  if (!details || typeof details !== "object") {
    addError(errors, "plannerDetails", "Planner details are required for this category.");
    return;
  }

  if (!isIntegerInRange(details.expectedAttendees, 1, 1000000)) {
    addError(errors, "plannerDetails.expectedAttendees", "Expected attendees must be a whole number of at least 1.");
  }

  if (!isIntegerInRange(details.budget, 0, 1000000000)) {
    addError(errors, "plannerDetails.budget", "Budget must be a whole number of 0 or more.");
  }

  validateStringArray(details.requiredServices, PLANNER_SERVICES, "plannerDetails.requiredServices", "service", errors);

  if (!EXPERIENCE_LEVELS.includes(details.experience)) {
    addError(errors, "plannerDetails.experience", "Select a valid experience level.");
  }

  if (!isIntegerInRange(details.numberOfPlanners, 1, 50)) {
    addError(errors, "plannerDetails.numberOfPlanners", "Number of planners must be between 1 and 50.");
  }

  if (details.additionalNotes && !isNonEmptyString(details.additionalNotes, 1, 1000)) {
    addError(errors, "plannerDetails.additionalNotes", "Additional notes must be 1000 characters or fewer.");
  }
}

function validatePerformerDetails(details, errors) {
  if (!details || typeof details !== "object") {
    addError(errors, "performerDetails", "Performer details are required for this category.");
    return;
  }

  if (!PERFORMER_TYPES.includes(details.performerType)) {
    addError(errors, "performerDetails.performerType", "Select a valid performer type.");
  }

  if (!GENRES.includes(details.genre)) {
    addError(errors, "performerDetails.genre", "Select a valid genre.");
  }

  if (!isIntegerInRange(details.performerCount, 1, 100)) {
    addError(errors, "performerDetails.performerCount", "Performer count must be between 1 and 100.");
  }

  if (!isNonEmptyString(details.performanceDuration, 2, 80)) {
    addError(errors, "performerDetails.performanceDuration", "Performance duration is required.");
  }

  if (!isIntegerInRange(details.budget, 0, 1000000000)) {
    addError(errors, "performerDetails.budget", "Budget must be a whole number of 0 or more.");
  }

  if (!EQUIPMENT_OPTIONS.includes(details.equipment)) {
    addError(errors, "performerDetails.equipment", "Select a valid equipment option.");
  }

  if (!LANGUAGES.includes(details.preferredLanguage)) {
    addError(errors, "performerDetails.preferredLanguage", "Select a preferred language.");
  }

  if (details.additionalNotes && !isNonEmptyString(details.additionalNotes, 1, 1000)) {
    addError(errors, "performerDetails.additionalNotes", "Additional notes must be 1000 characters or fewer.");
  }
}

function validateCrewDetails(details, errors) {
  if (!details || typeof details !== "object") {
    addError(errors, "crewDetails", "Crew details are required for this category.");
    return;
  }

  validateStringArray(details.requiredRoles, CREW_ROLES, "crewDetails.requiredRoles", "role", errors);

  if (!isIntegerInRange(details.crewCount, 1, 200)) {
    addError(errors, "crewDetails.crewCount", "Number of crew members must be between 1 and 200.");
  }

  if (!SHIFT_OPTIONS.includes(details.shiftHours)) {
    addError(errors, "crewDetails.shiftHours", "Select a valid shift/hours option.");
  }

  if (!EXPERIENCE_LEVELS.includes(details.experience)) {
    addError(errors, "crewDetails.experience", "Select a valid experience level.");
  }

  if (!isNonEmptyString(details.skillsEquipment, 3, 400)) {
    addError(errors, "crewDetails.skillsEquipment", "Skills and equipment must be between 3 and 400 characters.");
  }

  if (!PAYMENT_RANGES.includes(details.paymentRange)) {
    addError(errors, "crewDetails.paymentRange", "Select a valid payment range.");
  }

  if (details.additionalNotes && !isNonEmptyString(details.additionalNotes, 1, 1000)) {
    addError(errors, "crewDetails.additionalNotes", "Additional notes must be 1000 characters or fewer.");
  }
}

function sanitizeRequirement(body) {
  const category = body.category;
  const common = {
    eventName: String(body.eventName || "").trim(),
    eventType: body.eventType,
    startDate: body.startDate,
    endDate: body.endDate,
    location: String(body.location || "").trim(),
    venue: String(body.venue || "").trim(),
    category,
    status: "submitted",
  };

  if (category === "planner") {
    const details = body.plannerDetails || {};
    return {
      ...common,
      plannerDetails: {
        expectedAttendees: details.expectedAttendees,
        budget: details.budget,
        requiredServices: details.requiredServices,
        experience: details.experience,
        numberOfPlanners: details.numberOfPlanners,
        additionalNotes: String(details.additionalNotes || "").trim(),
      },
    };
  }

  if (category === "performer") {
    const details = body.performerDetails || {};
    return {
      ...common,
      performerDetails: {
        performerType: details.performerType,
        genre: details.genre,
        performerCount: details.performerCount,
        performanceDuration: String(details.performanceDuration || "").trim(),
        budget: details.budget,
        equipment: details.equipment,
        preferredLanguage: details.preferredLanguage,
        additionalNotes: String(details.additionalNotes || "").trim(),
      },
    };
  }

  const details = body.crewDetails || {};
  return {
    ...common,
    crewDetails: {
      requiredRoles: details.requiredRoles,
      crewCount: details.crewCount,
      shiftHours: details.shiftHours,
      experience: details.experience,
      skillsEquipment: String(details.skillsEquipment || "").trim(),
      paymentRange: details.paymentRange,
      additionalNotes: String(details.additionalNotes || "").trim(),
    },
  };
}

function validateRequirementPayload(body) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { errors: [{ field: "body", message: "Request body must be a JSON object." }] };
  }

  validateCommonFields(body, errors);

  if (body.category === "planner") {
    validatePlannerDetails(body.plannerDetails, errors);
    if (body.performerDetails || body.crewDetails) {
      addError(errors, "category", "Only planner details may be sent for the planner category.");
    }
  } else if (body.category === "performer") {
    validatePerformerDetails(body.performerDetails, errors);
    if (body.plannerDetails || body.crewDetails) {
      addError(errors, "category", "Only performer details may be sent for the performer category.");
    }
  } else if (body.category === "crew") {
    validateCrewDetails(body.crewDetails, errors);
    if (body.plannerDetails || body.performerDetails) {
      addError(errors, "category", "Only crew details may be sent for the crew category.");
    }
  }

  return { errors };
}

module.exports = {
  EVENT_TYPES,
  PLANNER_SERVICES,
  PERFORMER_TYPES,
  GENRES,
  LANGUAGES,
  CREW_ROLES,
  EXPERIENCE_LEVELS,
  EQUIPMENT_OPTIONS,
  SHIFT_OPTIONS,
  PAYMENT_RANGES,
  validateRequirementPayload,
  sanitizeRequirement,
};
