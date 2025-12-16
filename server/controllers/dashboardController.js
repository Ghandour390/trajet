import Vehicle from '../models/Vehicle.js';
import Trailer from '../models/Trailer.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import Maintenance from '../models/Maintenance.js';

class DashboardController {
    // @desc    Get dashboard statistics
    // @route   GET /api/dashboard/stats
    async getStats(req, res) {
        try {
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

            res.status(200).json({
                totalVehicles,
                totalTrailers,
                activeTrips,
                totalDrivers,
                pendingMaintenance
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get recent trips
    // @route   GET /api/dashboard/recent-trips
    async getRecentTrips(req, res) {
        try {
            const trips = await Trip.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('assignedTo', 'firstname lastname')
                .populate('vehicleRef', 'plateNumber');
            
            res.status(200).json(trips);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get vehicles needing attention
    // @route   GET /api/dashboard/vehicles-attention
    async getVehiclesNeedingAttention(req, res) {
        try {
            const vehicles = await Vehicle.find({
                $or: [
                    { status: 'maintenance' },
                    { status: 'inactive' }
                ]
            }).limit(10);
            
            res.status(200).json(vehicles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new DashboardController();
