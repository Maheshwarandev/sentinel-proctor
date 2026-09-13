import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Brother DB] Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Brother DB] MongoDB connection failed (${error.message}). Running in mock in-memory database mode.`);
    isConnected = false;
  }
};

export const getIsConnected = () => isConnected;
