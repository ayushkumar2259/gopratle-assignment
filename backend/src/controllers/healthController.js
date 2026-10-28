const mongoose = require("mongoose");

function getHealth(req, res) {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const healthy = dbState === 1;

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    service: "gopratle-requirements-api",
    status: healthy ? "ok" : "degraded",
    database: states[dbState] || "unknown",
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
