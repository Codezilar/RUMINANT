import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    
    if (!MONGODB_URL) {
      throw new Error('MONGODB_URL environment variable is not defined');
    }
    
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

export default connectMongoDB;