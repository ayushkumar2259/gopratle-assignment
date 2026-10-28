const mongoose = require("mongoose");

const CATEGORIES = ["planner", "performer", "crew"];
const STATUSES = ["submitted"];

const plannerDetailsSchema = new mongoose.Schema(
  {
    expectedAttendees: { type: Number, required: true, min: 1 },
    budget: { type: Number, required: true, min: 0 },
    requiredServices: {
      type: [String],
      required: true,
      validate: [(value) => value.length > 0, "At least one service is required"],
    },
    experience: { type: String, required: true, trim: true },
    numberOfPlanners: { type: Number, required: true, min: 1 },
    additionalNotes: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const performerDetailsSchema = new mongoose.Schema(
  {
    performerType: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    performerCount: { type: Number, required: true, min: 1 },
    performanceDuration: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    equipment: { type: String, required: true, trim: true },
    preferredLanguage: { type: String, required: true, trim: true },
    additionalNotes: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const crewDetailsSchema = new mongoose.Schema(
  {
    requiredRoles: {
      type: [String],
      required: true,
      validate: [(value) => value.length > 0, "At least one role is required"],
    },
    crewCount: { type: Number, required: true, min: 1 },
    shiftHours: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    skillsEquipment: { type: String, required: true, trim: true },
    paymentRange: { type: String, required: true, trim: true },
    additionalNotes: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const requirementSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    eventType: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    venue: { type: String, default: "", trim: true, maxlength: 160 },
    category: { type: String, required: true, enum: CATEGORIES },
    plannerDetails: { type: plannerDetailsSchema, default: undefined },
    performerDetails: { type: performerDetailsSchema, default: undefined },
    crewDetails: { type: crewDetailsSchema, default: undefined },
    status: { type: String, enum: STATUSES, default: "submitted" },
  },
  { timestamps: true }
);

requirementSchema.index({ createdAt: -1 });
requirementSchema.index({ category: 1, createdAt: -1 });

const Requirement = mongoose.model("Requirement", requirementSchema);

module.exports = {
  Requirement,
  CATEGORIES,
};
