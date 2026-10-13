import mongoose from 'mongoose';

let connected = false;

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.log(
      'ℹ️ [Database] MONGODB_URI not configured or placeholder detected. Operating in High-Performance In-Memory & File Storage Mode with 4 Seed Creators & 8 Portfolio Projects.'
    );
    return false;
  }

  try {
    console.log('🔄 [Database] Attempting connection to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    connected = true;
    console.log('✅ [Database] Successfully connected to MongoDB Atlas cluster.');
    return true;
  } catch (err: any) {
    console.warn(
      `⚠️ [Database] MongoDB Atlas connection failed (${err.message}). Seamlessly falling back to In-Memory store.`
    );
    connected = false;
    return false;
  }
};

export const isMongoConnected = () => connected;
