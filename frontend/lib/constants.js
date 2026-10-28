export const STEPS = [
  { id: 1, title: "Event basics", description: "Name, dates, location, and category" },
  { id: 2, title: "Requirements", description: "What you need for this event" },
  { id: 3, title: "Preferences", description: "Experience, notes, and extras" },
  { id: 4, title: "Review", description: "Confirm and submit" },
];

export const EVENT_TYPES = [
  "Wedding",
  "Corporate",
  "Concert",
  "Birthday",
  "Festival",
  "Conference",
  "Private Party",
  "Other",
];

export const CATEGORIES = [
  {
    value: "planner",
    label: "Event Planner",
    description: "Find planners to design and run the event.",
  },
  {
    value: "performer",
    label: "Performer",
    description: "Book singers, DJs, bands, or other talent.",
  },
  {
    value: "crew",
    label: "Crew",
    description: "Hire lighting, sound, photo, and stage crew.",
  },
];

export const PLANNER_SERVICES = [
  "Venue booking",
  "Decor",
  "Catering",
  "Logistics",
  "Guest management",
  "Full event management",
];

export const PERFORMER_TYPES = ["Singer", "DJ", "Band", "Dancer", "Magician", "Comedian", "Other"];
export const GENRES = ["Pop", "Rock", "Classical", "Bollywood", "Jazz", "Hip-hop", "Folk", "Other"];
export const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi", "Other"];
export const CREW_ROLES = [
  "Lighting",
  "Sound",
  "Photography",
  "Videography",
  "Stage management",
  "Security",
  "Catering staff",
  "Other",
];
export const EXPERIENCE_LEVELS = ["Entry-level", "1-3 years", "3-5 years", "5+ years"];
export const EQUIPMENT_OPTIONS = ["Need full setup", "Partial setup needed", "Self-equipped", "To be discussed"];
export const SHIFT_OPTIONS = ["4 hours", "6 hours", "8 hours", "12 hours", "Full event duration"];
export const PAYMENT_RANGES = [
  "Under Rs 10000",
  "Rs 10000-25000",
  "Rs 25000-50000",
  "Rs 50000-100000",
  "Above Rs 100000",
];

export const emptyPlannerDetails = {
  expectedAttendees: "",
  budget: "",
  requiredServices: [],
  experience: "",
  numberOfPlanners: "",
  additionalNotes: "",
};

export const emptyPerformerDetails = {
  performerType: "",
  genre: "",
  performerCount: "",
  performanceDuration: "",
  budget: "",
  equipment: "",
  preferredLanguage: "",
  additionalNotes: "",
};

export const emptyCrewDetails = {
  requiredRoles: [],
  crewCount: "",
  shiftHours: "",
  experience: "",
  skillsEquipment: "",
  paymentRange: "",
  additionalNotes: "",
};

export const initialFormData = {
  eventName: "",
  eventType: "",
  startDate: "",
  endDate: "",
  location: "",
  venue: "",
  category: "",
  plannerDetails: { ...emptyPlannerDetails },
  performerDetails: { ...emptyPerformerDetails },
  crewDetails: { ...emptyCrewDetails },
};
