import { CATEGORIES, CREW_ROLES, EQUIPMENT_OPTIONS, EVENT_TYPES, EXPERIENCE_LEVELS, GENRES, LANGUAGES, PAYMENT_RANGES, PERFORMER_TYPES, PLANNER_SERVICES, SHIFT_OPTIONS } from "./constants.js";

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toInt(value) {
  if (value === "" || value === null || value === undefined) {
    return NaN;
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : NaN;
  }
  if (!/^-?\d+$/.test(String(value).trim())) {
    return NaN;
  }
  return Number.parseInt(value, 10);
}

export function validateStep1(formData) {
  const errors = {};

  if (!formData.eventName || formData.eventName.trim().length < 3) {
    errors.eventName = "Enter an event name of at least 3 characters.";
  } else if (formData.eventName.trim().length > 120) {
    errors.eventName = "Event name must be 120 characters or fewer.";
  }

  if (!EVENT_TYPES.includes(formData.eventType)) {
    errors.eventType = "Select an event type.";
  }

  if (!isDate(formData.startDate)) {
    errors.startDate = "Choose a valid start date.";
  }

  if (!isDate(formData.endDate)) {
    errors.endDate = "Choose a valid end date.";
  }

  if (isDate(formData.startDate) && isDate(formData.endDate) && formData.endDate < formData.startDate) {
    errors.endDate = "End date cannot be earlier than the start date.";
  }

  if (!formData.location || formData.location.trim().length < 2) {
    errors.location = "Enter a city or location.";
  }

  if (formData.venue && formData.venue.trim().length > 160) {
    errors.venue = "Venue must be 160 characters or fewer.";
  }

  if (!CATEGORIES.some((item) => item.value === formData.category)) {
    errors.category = "Select Event Planner, Performer, or Crew.";
  }

  return errors;
}

export function validateStep2(formData) {
  const errors = {};

  if (formData.category === "planner") {
    const attendees = toInt(formData.plannerDetails.expectedAttendees);
    const budget = toInt(formData.plannerDetails.budget);

    if (!Number.isInteger(attendees) || attendees < 1) {
      errors.expectedAttendees = "Expected attendees must be a whole number of at least 1.";
    }
    if (!Number.isInteger(budget) || budget < 0) {
      errors.budget = "Budget must be a whole number of 0 or more.";
    }
    if (!formData.plannerDetails.requiredServices.length) {
      errors.requiredServices = "Select at least one required service.";
    } else if (formData.plannerDetails.requiredServices.some((item) => !PLANNER_SERVICES.includes(item))) {
      errors.requiredServices = "One or more selected services are invalid.";
    }
  }

  if (formData.category === "performer") {
    if (!PERFORMER_TYPES.includes(formData.performerDetails.performerType)) {
      errors.performerType = "Select a performer type.";
    }
    if (!GENRES.includes(formData.performerDetails.genre)) {
      errors.genre = "Select a genre.";
    }
    const count = toInt(formData.performerDetails.performerCount);
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      errors.performerCount = "Performer count must be between 1 and 100.";
    }
  }

  if (formData.category === "crew") {
    if (!formData.crewDetails.requiredRoles.length) {
      errors.requiredRoles = "Select at least one crew role.";
    } else if (formData.crewDetails.requiredRoles.some((item) => !CREW_ROLES.includes(item))) {
      errors.requiredRoles = "One or more selected roles are invalid.";
    }
    const count = toInt(formData.crewDetails.crewCount);
    if (!Number.isInteger(count) || count < 1 || count > 200) {
      errors.crewCount = "Number of crew members must be between 1 and 200.";
    }
    if (!SHIFT_OPTIONS.includes(formData.crewDetails.shiftHours)) {
      errors.shiftHours = "Select shift or hours.";
    }
  }

  return errors;
}

export function validateStep3(formData) {
  const errors = {};

  if (formData.category === "planner") {
    if (!EXPERIENCE_LEVELS.includes(formData.plannerDetails.experience)) {
      errors.experience = "Select the experience you need.";
    }
    const planners = toInt(formData.plannerDetails.numberOfPlanners);
    if (!Number.isInteger(planners) || planners < 1 || planners > 50) {
      errors.numberOfPlanners = "Number of planners must be between 1 and 50.";
    }
    if (formData.plannerDetails.additionalNotes.length > 1000) {
      errors.additionalNotes = "Notes must be 1000 characters or fewer.";
    }
  }

  if (formData.category === "performer") {
    if (!formData.performerDetails.performanceDuration.trim()) {
      errors.performanceDuration = "Enter the performance duration.";
    }
    const budget = toInt(formData.performerDetails.budget);
    if (!Number.isInteger(budget) || budget < 0) {
      errors.budget = "Budget must be a whole number of 0 or more.";
    }
    if (!EQUIPMENT_OPTIONS.includes(formData.performerDetails.equipment)) {
      errors.equipment = "Select an equipment option.";
    }
    if (!LANGUAGES.includes(formData.performerDetails.preferredLanguage)) {
      errors.preferredLanguage = "Select a preferred language.";
    }
    if (formData.performerDetails.additionalNotes.length > 1000) {
      errors.additionalNotes = "Notes must be 1000 characters or fewer.";
    }
  }

  if (formData.category === "crew") {
    if (!EXPERIENCE_LEVELS.includes(formData.crewDetails.experience)) {
      errors.experience = "Select the experience you need.";
    }
    if (!formData.crewDetails.skillsEquipment.trim() || formData.crewDetails.skillsEquipment.trim().length < 3) {
      errors.skillsEquipment = "Describe required skills or equipment.";
    }
    if (!PAYMENT_RANGES.includes(formData.crewDetails.paymentRange)) {
      errors.paymentRange = "Select a payment range.";
    }
    if (formData.crewDetails.additionalNotes.length > 1000) {
      errors.additionalNotes = "Notes must be 1000 characters or fewer.";
    }
  }

  return errors;
}

export function validateAll(formData) {
  return {
    ...validateStep1(formData),
    ...validateStep2(formData),
    ...validateStep3(formData),
  };
}

export function buildPayload(formData) {
  const payload = {
    eventName: formData.eventName.trim(),
    eventType: formData.eventType,
    startDate: formData.startDate,
    endDate: formData.endDate,
    location: formData.location.trim(),
    venue: formData.venue.trim(),
    category: formData.category,
  };

  if (formData.category === "planner") {
    payload.plannerDetails = {
      expectedAttendees: toInt(formData.plannerDetails.expectedAttendees),
      budget: toInt(formData.plannerDetails.budget),
      requiredServices: formData.plannerDetails.requiredServices,
      experience: formData.plannerDetails.experience,
      numberOfPlanners: toInt(formData.plannerDetails.numberOfPlanners),
      additionalNotes: formData.plannerDetails.additionalNotes.trim(),
    };
  }

  if (formData.category === "performer") {
    payload.performerDetails = {
      performerType: formData.performerDetails.performerType,
      genre: formData.performerDetails.genre,
      performerCount: toInt(formData.performerDetails.performerCount),
      performanceDuration: formData.performerDetails.performanceDuration.trim(),
      budget: toInt(formData.performerDetails.budget),
      equipment: formData.performerDetails.equipment,
      preferredLanguage: formData.performerDetails.preferredLanguage,
      additionalNotes: formData.performerDetails.additionalNotes.trim(),
    };
  }

  if (formData.category === "crew") {
    payload.crewDetails = {
      requiredRoles: formData.crewDetails.requiredRoles,
      crewCount: toInt(formData.crewDetails.crewCount),
      shiftHours: formData.crewDetails.shiftHours,
      experience: formData.crewDetails.experience,
      skillsEquipment: formData.crewDetails.skillsEquipment.trim(),
      paymentRange: formData.crewDetails.paymentRange,
      additionalNotes: formData.crewDetails.additionalNotes.trim(),
    };
  }

  return payload;
}
