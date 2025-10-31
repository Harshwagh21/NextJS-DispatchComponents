import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
  var _mongoose: MongooseCache | undefined;
}

const globalForMongoose = global as unknown as { _mongoose?: MongooseCache };
const cached: MongooseCache = globalForMongoose._mongoose ?? (globalForMongoose._mongoose = { conn: null, promise: null });

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Use hardcoded URI with proper URL encoding to avoid env issues
    const uri = "mongodb+srv://mongodb:metrics-next%3ADB@metrics-next.ftr25yg.mongodb.net/metrics-db?retryWrites=true&w=majority&appName=Metrics-next";
    
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


