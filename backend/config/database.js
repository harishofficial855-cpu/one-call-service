import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    }).then((m) => {
      console.log(`✓ MongoDB connected successfully`);
      console.log(`Database: ${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('✗ MongoDB connection failed:', error.message);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
