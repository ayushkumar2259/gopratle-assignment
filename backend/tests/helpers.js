const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { createApp } = require("../src/app");

async function setupTestApp() {
  const memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
  const app = createApp();
  return { app, memoryServer };
}

async function teardownTestApp(memoryServer) {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}

function validPlannerPayload(overrides = {}) {
  return {
    eventName: "Spring Garden Wedding",
    eventType: "Wedding",
    startDate: "2026-12-12",
    endDate: "2026-12-12",
    location: "Bengaluru",
    venue: "Lalbagh Glass House",
    category: "planner",
    plannerDetails: {
      expectedAttendees: 180,
      budget: 250000,
      requiredServices: ["Decor", "Catering"],
      experience: "3-5 years",
      numberOfPlanners: 2,
      additionalNotes: "Prefer sustainable decor.",
    },
    ...overrides,
  };
}

function validPerformerPayload(overrides = {}) {
  return {
    eventName: "College Fest Night",
    eventType: "Festival",
    startDate: "2026-11-20",
    endDate: "2026-11-21",
    location: "Pune",
    venue: "",
    category: "performer",
    performerDetails: {
      performerType: "Band",
      genre: "Rock",
      performerCount: 4,
      performanceDuration: "90 minutes",
      budget: 80000,
      equipment: "Need full setup",
      preferredLanguage: "English",
      additionalNotes: "",
    },
    ...overrides,
  };
}

function validCrewPayload(overrides = {}) {
  return {
    eventName: "Product Launch",
    eventType: "Corporate",
    startDate: "2026-10-30",
    endDate: "2026-10-30",
    location: "Hyderabad",
    venue: "HICC",
    category: "crew",
    crewDetails: {
      requiredRoles: ["Lighting", "Sound"],
      crewCount: 6,
      shiftHours: "8 hours",
      experience: "1-3 years",
      skillsEquipment: "Wireless mics, LED walls, and follow spots.",
      paymentRange: "Rs 25000-50000",
      additionalNotes: "Need overnight load-out support.",
    },
    ...overrides,
  };
}

module.exports = {
  setupTestApp,
  teardownTestApp,
  validPlannerPayload,
  validPerformerPayload,
  validCrewPayload,
};
