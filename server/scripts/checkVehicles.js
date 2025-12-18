import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/Vehicle.js';

dotenv.config();

const checkVehicles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check all vehicles
        const allVehicles = await Vehicle.find().lean();
        console.log('📊 Total vehicles:', allVehicles.length);
        
        // Group by status
        const byStatus = {};
        allVehicles.forEach(v => {
            byStatus[v.status] = (byStatus[v.status] || 0) + 1;
        });
        
        console.log('\n📈 Vehicles by status:');
        Object.entries(byStatus).forEach(([status, count]) => {
            console.log(`  - ${status}: ${count}`);
        });

        // Show maintenance vehicles
        const maintenanceVehicles = await Vehicle.find({ status: 'maintenance' }).lean();
        console.log('\n🔧 Vehicles in maintenance:');
        maintenanceVehicles.forEach(v => {
            console.log(`  - ${v.plateNumber} (${v.brand} ${v.model || ''})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkVehicles();
