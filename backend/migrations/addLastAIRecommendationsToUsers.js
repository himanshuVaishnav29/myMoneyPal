import mongoose from 'mongoose';
import dotenv from 'dotenv';
import USER from '../models/userSchema.js';

dotenv.config();

const addLastAIRecommendationsToUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await USER.updateMany(
      { lastAIRecommendations: { $exists: false } },
      { $set: { lastAIRecommendations: null } }
    );

    console.log(`Migration completed: ${result.modifiedCount} users updated`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

addLastAIRecommendationsToUsers();
