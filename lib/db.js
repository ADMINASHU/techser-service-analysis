// Connect to MongoDB
import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) return;
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
    } catch (error) {
        console.log(error);
    }
  };