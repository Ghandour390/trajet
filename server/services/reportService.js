import Trip from '../models/Trip.js';
import Fuel from '../models/Fuel.js';

class ReportService {
    async getStats(period) {
        const dateRange = this.getDateRange(period);

        const [trips, fuelRecords] = await Promise.all([
            Trip.find({
                createdAt: { $gte: dateRange.start, $lte: dateRange.end },
                status: 'completed'
            }),
            Fuel.find({
                createdAt: { $gte: dateRange.start, $lte: dateRange.end }
            })
        ]);

        const totalDistance = trips.reduce((sum, trip) => {
            const distance = (trip.endKm || 0) - (trip.startKm || 0);
            return sum + (distance > 0 ? distance : 0);
        }, 0);

        const totalFuel = fuelRecords.reduce((sum, fuel) => sum + (fuel.volume || 0), 0);
        const totalCost = fuelRecords.reduce((sum, fuel) => sum + (fuel.cost || 0), 0);
        const avgConsumption = totalDistance > 0 ? (totalFuel / totalDistance * 100) : 0;

        return {
            totalDistance,
            totalFuel,
            totalCost,
            avgConsumption: parseFloat(avgConsumption.toFixed(2)),
            totalTrips: trips.length
        };
    }

    getDateRange(period) {
        const end = new Date();
        const start = new Date();

        switch (period) {
            case 'week':
                start.setDate(end.getDate() - 7);
                break;
            case 'month':
                start.setMonth(end.getMonth() - 1);
                break;
            case 'quarter':
                start.setMonth(end.getMonth() - 3);
                break;
            case 'year':
                start.setFullYear(end.getFullYear() - 1);
                break;
            default:
                start.setMonth(end.getMonth() - 1);
        }

        return { start, end };
    }
}

export default new ReportService();
