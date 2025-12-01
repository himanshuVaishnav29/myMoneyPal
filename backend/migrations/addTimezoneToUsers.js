import mongoose from 'mongoose';
import USER from '../models/userSchema.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const addTimezoneToUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB');

        // Update all users without timezone to have UTC as default
        const result = await USER.updateMany(
            { timezone: { $exists: false } },
            { $set: { timezone: 'UTC' } }
        );

        console.log(`Updated ${result.modifiedCount} users with default timezone`);
        
        await mongoose.disconnect();
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

// Run migration if this file is executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//     addTimezoneToUsers();
// }
addTimezoneToUsers();
export default addTimezoneToUsers;