import Vehicle from '../models/Vehicle.js';
import Trailer from '../models/Trailer.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

class DashboardService {
    async getStats() {
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
                (await import('../models/Maintenance.js')).default.countDocuments({ status: 'pending' })
            ]);

            return {
                totalVehicles,
                totalTrailers,
                activeTrips,
                totalDrivers,
                pendingMaintenance
            };
        } catch {
            return {
                totalVehicles: 0,
                totalTrailers: 0,
                activeTrips: 0,
                totalDrivers: 0,
                pendingMaintenance: 0
            };
        }
    }

    async getFuelChartData(period = 'month') {
        try {
            const dateRange = this.getDateRange(period);
            const Fuel = (await import('../models/Fuel.js')).default;
            const fuelData = await Fuel.aggregate([
                { $match: { date: { $gte: dateRange.start, $lte: dateRange.end } } },
                { 
                    $group: { 
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' }
                        },
                        consumption: { $sum: '$liters' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 12 }
            ]);

            return this.formatChartData(fuelData, period, 'consumption');
        } catch (error) {
            console.error('Fuel chart error:', error);
            return [];
        }
    }

    async getKilometrageChartData(period = 'month') {
        try {
            const dateRange = this.getDateRange(period);
            const trips = await Trip.aggregate([
                { $match: { startDate: { $gte: dateRange.start, $lte: dateRange.end }, distance: { $exists: true, $ne: null } } },
                { 
                    $group: { 
                        _id: {
                            year: { $year: '$startDate' },
                            month: { $month: '$startDate' }
                        },
                        kilometrage: { $sum: '$distance' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 12 }
            ]);

            return this.formatChartData(trips, period, 'kilometrage');
        } catch (error) {
            console.error('Kilometrage chart error:', error);
            return [];
        }
    }

    getDateRange(period) {
        const end = new Date();
        const start = new Date();
        switch (period) {
            case 'week': start.setDate(end.getDate() - 7); break;
            case 'month': start.setMonth(end.getMonth() - 1); break;
            case 'quarter': start.setMonth(end.getMonth() - 3); break;
            case 'year': start.setFullYear(end.getFullYear() - 1); break;
            default: start.setMonth(end.getMonth() - 1);
        }
        return { start, end };
    }



    formatChartData(data, period, valueKey) {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        return data.map(item => {
            let label;
            if (period === 'week' && item._id.day) {
                label = `${item._id.day}/${item._id.month}`;
            } else if (period === 'year') {
                label = months[item._id.month - 1];
            } else {
                label = months[item._id.month - 1];
            }
            
            return {
                month: label,
                [valueKey]: Math.round(item[valueKey] || 0)
            };
        });
    }

    async getRecentTrips() {
        return await Trip.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('assignedTo', 'firstname lastname')
            .populate('vehicleRef', 'plateNumber');
    }

    async getVehiclesNeedingAttention() {
        const vehicles = await Vehicle.find({
            $or: [
                { status: 'maintenance' },
                { status: 'inactive' }
            ]
        })
            .limit(10);

        return vehicles;
    }
}

export default new DashboardService();
