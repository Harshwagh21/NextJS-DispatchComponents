import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
  var _mongoose: MongooseCache | undefined;
}

const getCache = (): MongooseCache => {
  if (!global._mongoose) global._mongoose = { conn: null, promise: null };
  return global._mongoose;
};

const uri = "mongodb+srv://mongodb:metrics-next%3ADB@metrics-next.ftr25yg.mongodb.net/metrics-db?retryWrites=true&w=majority&appName=Metrics-next";

export async function connectToDatabase(): Promise<typeof mongoose> {
  const cached = getCache();
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  
  return (cached.conn = await cached.promise);
}


