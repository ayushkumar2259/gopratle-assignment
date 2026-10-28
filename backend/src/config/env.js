const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

function parseOrigins(value) {
  if (!value) {
    return ["http://localhost:3000"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "",
  frontendOrigins: parseOrigins(process.env.FRONTEND_URL),
};

function isMemoryDatabase() {
  return env.mongoUri === "memory" || env.mongoUri === "in-memory";
}

module.exports = { env, isMemoryDatabase };
