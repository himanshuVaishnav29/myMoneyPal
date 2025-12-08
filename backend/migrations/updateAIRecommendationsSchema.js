import mongoose from 'mongoose';
import dotenv from 'dotenv';
import USER from '../models/userSchema.js';

dotenv.config();

const updateAIRecommendationsSchema = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all users to have new AI recommendation fields
    const result = await USER.updateMany(
      {},
      {
        $set: {
          lastAIRecommendationsDate: null,
          aiRefreshCount: 0,
          lastAIRefreshDate: null
        },
        $unset: {
          lastAIRefresh: ""
        }
      }
    );

    console.log(`Migration completed: ${result.modifiedCount} users updated`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

updateAIRecommendationsSchema();
