import mongoose from "mongoose";

const MONGODB_URI = process.env.DB;

// Global cache for dev environments
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalAny = globalThis as unknown as Record<string, unknown>;
let cached = globalAny.mongoose as MongooseCache | undefined;

if (!cached) {
  const init: MongooseCache = {
    conn: null,
    promise: null,
  };
  globalAny.mongoose = init as unknown;
  cached = init;
}

// At this point `cached` is guaranteed to be defined
const cache: MongooseCache = cached as MongooseCache;

export async function connectDb(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the DB environment variable in .env");
  }

  if (!cache.promise) {
    console.log("🌐 Creating a new MongoDB connection...");
    cache.promise = mongoose.connect(MONGODB_URI, {
      dbName: "TALENT_BRIDGE",
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
    console.log("✅ MongoDB connected.");
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}