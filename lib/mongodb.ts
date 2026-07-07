import mongoose, { type Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * In development, Next.js clears the module cache on every hot reload, which
 * would open a brand-new database connection each time. In a serverless
 * deployment, every function invocation can reuse a warm container. To avoid
 * exhausting the connection pool in either case, we cache the connection (and
 * the in-flight connect promise) on the global object so it survives reloads.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? {
  conn: null,
  promise: null,
};

global._mongoose = cached;

export default async function dbConnect(): Promise<Mongoose> {
  // Reuse an already-established connection.
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse an in-flight connection attempt so concurrent callers share one.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so the next call can retry a failed connection.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
