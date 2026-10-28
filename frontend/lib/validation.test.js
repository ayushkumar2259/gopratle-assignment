import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateStep1, validateStep2, validateStep3, validateAll, buildPayload } from "./validation.js";

const baseForm = {
  eventName: "Spring Garden Wedding",
  eventType: "Wedding",
  startDate: "2026-12-12",
  endDate: "2026-12-12",
  location: "Bengaluru",
  venue: "",
};

function performerForm() {
  return {
    ...baseForm,
    category: "performer",
    performerDetails: {
      performerType: "Band",
      genre: "Rock",
      performerCount: "4",
      performanceDuration: "90 minutes",
      budget: "80000",
      equipment: "Need full setup",
      preferredLanguage: "English",
      additionalNotes: "",
    },
  };
}

function crewForm() {
  return {
    ...baseForm,
    category: "crew",
    crewDetails: {
      requiredRoles: ["Lighting", "Sound"],
      crewCount: "6",
      shiftHours: "8 hours",
      experience: "1-3 years",
      skillsEquipment: "Wireless mics, LED walls",
      paymentRange: "Rs 25000-50000",
      additionalNotes: "Need overnight load-out support.",
    },
  };
}

describe("frontend validation - performer", () => {
  it("passes a complete performer form", () => {
    assert.deepEqual(validateAll(performerForm()), {});
  });

  it("requires performer type on step 2", () => {
    const form = performerForm();
    form.performerDetails.performerType = "";
    const errors = validateStep2(form);
    assert.ok(errors.performerType);
  });

  it("requires genre on step 2", () => {
    const form = performerForm();
    form.performerDetails.genre = "";
    const errors = validateStep2(form);
    assert.ok(errors.genre);
  });

  it("validates performer count range on step 2", () => {
    const form = performerForm();
    form.performerDetails.performerCount = "0";
    const errors = validateStep2(form);
    assert.ok(errors.performerCount);
  });

  it("requires performance duration on step 3", () => {
    const form = performerForm();
    form.performerDetails.performanceDuration = "";
    const errors = validateStep3(form);
    assert.ok(errors.performanceDuration);
  });

  it("requires equipment option on step 3", () => {
    const form = performerForm();
    form.performerDetails.equipment = "";
    const errors = validateStep3(form);
    assert.ok(errors.equipment);
  });

  it("requires preferred language on step 3", () => {
    const form = performerForm();
    form.performerDetails.preferredLanguage = "";
    const errors = validateStep3(form);
    assert.ok(errors.preferredLanguage);
  });

  it("builds a performer payload without other category details", () => {
    const payload = buildPayload(performerForm());
    assert.equal(payload.category, "performer");
    assert.equal(payload.performerDetails.performerType, "Band");
    assert.equal(payload.performerDetails.performerCount, 4);
    assert.equal(payload.plannerDetails, undefined);
    assert.equal(payload.crewDetails, undefined);
  });
});

describe("frontend validation - crew", () => {
  it("passes a complete crew form", () => {
    assert.deepEqual(validateAll(crewForm()), {});
  });

  it("requires at least one crew role on step 2", () => {
    const form = crewForm();
    form.crewDetails.requiredRoles = [];
    const errors = validateStep2(form);
    assert.ok(errors.requiredRoles);
  });

  it("validates crew count range on step 2", () => {
    const form = crewForm();
    form.crewDetails.crewCount = "0";
    const errors = validateStep2(form);
    assert.ok(errors.crewCount);
  });

  it("requires shift hours on step 2", () => {
    const form = crewForm();
    form.crewDetails.shiftHours = "";
    const errors = validateStep2(form);
    assert.ok(errors.shiftHours);
  });

  it("requires experience on step 3", () => {
    const form = crewForm();
    form.crewDetails.experience = "";
    const errors = validateStep3(form);
    assert.ok(errors.experience);
  });

  it("requires skills/equipment on step 3", () => {
    const form = crewForm();
    form.crewDetails.skillsEquipment = "";
    const errors = validateStep3(form);
    assert.ok(errors.skillsEquipment);
  });

  it("requires payment range on step 3", () => {
    const form = crewForm();
    form.crewDetails.paymentRange = "";
    const errors = validateStep3(form);
    assert.ok(errors.paymentRange);
  });

  it("builds a crew payload without other category details", () => {
    const payload = buildPayload(crewForm());
    assert.equal(payload.category, "crew");
    assert.deepEqual(payload.crewDetails.requiredRoles, ["Lighting", "Sound"]);
    assert.equal(payload.crewDetails.crewCount, 6);
    assert.equal(payload.plannerDetails, undefined);
    assert.equal(payload.performerDetails, undefined);
  });
});

describe("frontend validation - date validation", () => {
  it("requires event basics", () => {
    const errors = validateStep1({});
    assert.ok(errors.eventName);
    assert.ok(errors.eventType);
    assert.ok(errors.startDate);
    assert.ok(errors.category);
  });

  it("rejects an inverted date range", () => {
    const errors = validateStep1({
      ...baseForm,
      startDate: "2026-12-12",
      endDate: "2026-12-01",
      category: "planner",
      plannerDetails: { requiredServices: ["Decor"] },
    });
    assert.equal(errors.endDate, "End date cannot be earlier than the start date.");
  });

  it("allows a single-day event", () => {
    const errors = validateStep1({
      ...baseForm,
      category: "planner",
      plannerDetails: { requiredServices: ["Decor"] },
    });
    assert.deepEqual(errors, {});
  });
});

describe("frontend validation - buildPayload planner", () => {
  it("builds a planner payload without other category details", () => {
    const payload = buildPayload({
      ...baseForm,
      category: "planner",
      plannerDetails: {
        expectedAttendees: "180",
        budget: "250000",
        requiredServices: ["Decor", "Catering"],
        experience: "3-5 years",
        numberOfPlanners: "2",
        additionalNotes: "Prefer sustainable decor.",
      },
    });
    assert.equal(payload.category, "planner");
    assert.equal(payload.plannerDetails.expectedAttendees, 180);
    assert.equal(payload.performerDetails, undefined);
    assert.equal(payload.crewDetails, undefined);
  });

  it("passes a complete planner form", () => {
    assert.deepEqual(
      validateAll({
        ...baseForm,
        category: "planner",
        plannerDetails: {
          expectedAttendees: "180",
          budget: "250000",
          requiredServices: ["Decor", "Catering"],
          experience: "3-5 years",
          numberOfPlanners: "2",
          additionalNotes: "Prefer sustainable decor.",
        },
      }),
      {}
    );
  });
});