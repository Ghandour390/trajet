import Vehicle from '../models/Vehicle.js';
import Trailer from '../models/Trailer.js';
import Trip from '../models/Trip.js';
import User from '../models/User.js';
import Maintenance from '../models/Maintenance.js';

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
                Vehicle.countDocuments().lean(),
                Trailer.countDocuments().lean(),
                Trip.countDocuments({ status: 'in_progress' }).lean(),
                User.countDocuments({ role: 'chauffeur' }).lean(),
                Maintenance.countDocuments({ status: 'pending' }).lean()
            ]);

            return {
                totalVehicles,
                totalTrailers,
                activeTrips,
                totalDrivers,
                pendingMaintenance
            };
        } catch (error) {
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
            const groupBy = this.getGroupByFormat(period);

            const Fuel = (await import('../models/Fuel.js')).default;
            const fuelData = await Fuel.aggregate([
                { $match: { date: { $gte: dateRange.start, $lte: dateRange.end } } },
                { $group: { _id: groupBy, consumption: { $sum: '$quantity' } } },
                { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
                { $limit: 12 }
            ]);

            return this.formatChartData(fuelData, period, 'consumption');
        } catch (error) {
            return [];
        }
    }

    async getKilometrageChartData(period = 'month') {
        try {
            const dateRange = this.getDateRange(period);
            const groupBy = this.getGroupByFormat(period);

            const trips = await Trip.aggregate([
                { $match: { startDate: { $gte: dateRange.start, $lte: dateRange.end } } },
                { $group: { _id: groupBy, kilometrage: { $sum: '$distance' } } },
                { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
                { $limit: 12 }
            ]);

            return this.formatChartData(trips, period, 'kilometrage');
        } catch (error) {
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

    getGroupByFormat(period) {
        if (period === 'week') {
            return { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } };
        }
        return { year: { $year: '$date' }, month: { $month: '$date' } };
    }

    formatChartData(data, period, valueKey) {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        
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
            .populate('vehicleRef', 'plateNumber')
            .lean();
    }

    async getVehiclesNeedingAttention() {
        return await Vehicle.find({
            $or: [
                { status: 'maintenance' },
                { status: 'inactive' }
            ]
        }).limit(5).lean();
    }
}

export default new DashboardService();
