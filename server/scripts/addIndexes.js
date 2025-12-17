import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const addIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        // Add indexes for performance
        await db.collection('vehicles').createIndex({ status: 1 });
        await db.collection('trips').createIndex({ status: 1 });
        await db.collection('trips').createIndex({ startDate: -1 });
        await db.collection('trips').createIndex({ createdAt: -1 });
        await db.collection('users').createIndex({ role: 1 });
        await db.collection('maintenances').createIndex({ status: 1 });
        await db.collection('fuels').createIndex({ date: -1 });

        console.log('✅ Indexes created successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

addIndexes();
