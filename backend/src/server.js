const { env } = require("./config/env");
const { createApp } = require("./app");
const { connectDatabase } = require("./config/db");

async function start() {
  await connectDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
