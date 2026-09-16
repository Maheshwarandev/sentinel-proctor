import mongoose from 'mongoose';
import dns from 'dns';
import { ENV } from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  // Resolve SRV records reliably on Windows across all ISPs (e.g. Atlas mongodb+srv://)
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // Keep system default if DNS override not permitted
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 6000,
    });
    isConnected = true;
    console.log(`[Brother DB] Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Brother DB] MongoDB connection failed (${error.message}). Running in mock in-memory database mode.`);
    isConnected = false;
  }
};

export const getIsConnected = () => isConnected;
