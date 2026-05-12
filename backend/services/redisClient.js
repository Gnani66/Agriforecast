const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  socket: {
    reconnectStrategy: false // Prevent spamming ECONNREFUSED if Redis is not running
  }
});

let isConnected = false;
let memoryCache = {}; // Fallback in-memory cache
let hasLoggedError = false;

client.on("error", (err) => {
  if (!hasLoggedError) {
    console.warn("Redis not running - using local memory cache instead.");
    hasLoggedError = true;
  }
  isConnected = false;
});

client.on("connect", () => {
  console.log("Redis Connected");
  isConnected = true;
});

const connectRedis = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.warn("Could not connect to Redis, using in-memory fallback.");
  }
};

const setCache = async (key, value, expiry = 3600) => {
  if (isConnected) {
    try {
      await client.setEx(key, expiry, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("Redis set failed, falling back to memory");
    }
  }
  memoryCache[key] = {
    value,
    expiry: Date.now() + expiry * 1000
  };
  return true;
};

const getCache = async (key) => {
  if (isConnected) {
    try {
      const data = await client.get(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn("Redis get failed, falling back to memory");
    }
  }
  const cached = memoryCache[key];
  if (cached && cached.expiry > Date.now()) {
    return cached.value;
  }
  if (cached && cached.expiry <= Date.now()) {
    delete memoryCache[key];
  }
  return null;
};

module.exports = {
  client,
  connectRedis,
  setCache,
  getCache
};
