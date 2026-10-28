import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { initialFormData } from "./constants.js";
import { buildPayload, validateAll, validateStep1, validateStep2 } from "./validation.js";

function plannerForm() {
  return {
    ...initialFormData,
    eventName: "Spring Garden Wedding",
    eventType: "Wedding",
    startDate: "2026-12-12",
    endDate: "2026-12-12",
    location: "Bengaluru",
    venue: "Lalbagh",
    category: "planner",
    plannerDetails: {
      expectedAttendees: "180",
      budget: "250000",
      requiredServices: ["Decor", "Catering"],
      experience: "3-5 years",
      numberOfPlanners: "2",
      additionalNotes: "Prefer sustainable decor.",
    },
  };
}

describe("frontend validation", () => {
  it("requires event basics", () => {
    const errors = validateStep1(initialFormData);
    assert.ok(errors.eventName);
    assert.ok(errors.eventType);
    assert.ok(errors.startDate);
    assert.ok(errors.category);
  });

  it("rejects an inverted date range", () => {
    const errors = validateStep1({
      ...plannerForm(),
      startDate: "2026-12-12",
      endDate: "2026-12-01",
    });
    assert.equal(errors.endDate, "End date cannot be earlier than the start date.");
  });

  it("allows a single-day event", () => {
    const errors = validateStep1(plannerForm());
    assert.deepEqual(errors, {});
  });

  it("requires planner services on step 2", () => {
    const form = plannerForm();
    form.plannerDetails.requiredServices = [];
    const errors = validateStep2(form);
    assert.ok(errors.requiredServices);
  });

  it("builds a planner payload without other category details", () => {
    const payload = buildPayload(plannerForm());
    assert.equal(payload.category, "planner");
    assert.equal(payload.plannerDetails.expectedAttendees, 180);
    assert.equal(payload.performerDetails, undefined);
    assert.equal(payload.crewDetails, undefined);
  });

  it("passes a complete planner form", () => {
    assert.deepEqual(validateAll(plannerForm()), {});
  });
});
