import Vehicle from '../models/Vehicle.js';
import Trailer from '../models/Trailer.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import Maintenance from '../models/Maintenance.js';

class DashboardService {
    async getStats() {
        const [
            totalVehicles,
            totalTrailers,
            activeTrips,
            totalDrivers,
            pendingMaintenance
        ] = await Promise.all([
            Vehicle.countDocuments(),
            Trailer.countDocuments(),
            Trip.countDocuments({ status: 'in_progress' }),
            User.countDocuments({ role: 'chauffeur' }),
            Maintenance.countDocuments({ status: 'pending' })
        ]);

        return {
            totalVehicles,
            totalTrailers,
            activeTrips,
            totalDrivers,
            pendingMaintenance
        };
    }

    async getRecentTrips() {
        return await Trip.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('assignedTo', 'firstname lastname')
            .populate('vehicleRef', 'plateNumber');
    }

    async getVehiclesNeedingAttention() {
        return await Vehicle.find({
            $or: [
                { status: 'maintenance' },
                { status: 'inactive' }
            ]
        }).limit(10);
    }
}

export default new DashboardService();
