const mongoose = require("mongoose");
const { env, isMemoryDatabase } = require("./env");

let memoryServer;

async function connectDatabase() {
  mongoose.set("strictQuery", true);

  if (isMemoryDatabase()) {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    return { uri, memory: true };
  }

  if (!env.mongoUri) {
    throw new Error(
      "MONGODB_URI is not set. Copy backend/.env.example to backend/.env and add your Atlas connection string."
    );
  }

  await mongoose.connect(env.mongoUri);
  return { uri: env.mongoUri, memory: false };
}

async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectDatabase, disconnectDatabase };
