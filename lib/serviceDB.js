import mongoose from 'mongoose';

const SERVICE_DB_URI = process.env.SERVICE_DB_URI;

if (!SERVICE_DB_URI) {
  throw new Error('Please define the SERVICE_EASE_DB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToServiceEaseDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    
    cached.promise = mongoose.connect(SERVICE_DB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToServiceEaseDB;


