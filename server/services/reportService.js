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

    async getFuelChartData(period) {
        const dateRange = this.getDateRange(period);
        const groupBy = this.getGroupByFormat(period);

        const fuelData = await Fuel.aggregate([
            { $match: { date: { $gte: dateRange.start, $lte: dateRange.end } } },
            {
                $group: {
                    _id: groupBy,
                    consumption: { $sum: '$volume' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 } }
        ]);

        return this.formatChartData(fuelData, period, 'consumption');
    }

    async getKilometrageChartData(period) {
        const dateRange = this.getDateRange(period);
        const groupBy = this.getGroupByFormat(period);

        const trips = await Trip.aggregate([
            { $match: { startDate: { $gte: dateRange.start, $lte: dateRange.end } } },
            {
                $group: {
                    _id: groupBy,
                    kilometrage: { $sum: '$distance' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1, '_id.day': 1 } }
        ]);

        return this.formatChartData(trips, period, 'kilometrage');
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

    getGroupByFormat(period) {
        if (period === 'week') {
            return {
                year: { $year: '$date' },
                month: { $month: '$date' },
                day: { $dayOfMonth: '$date' }
            };
        }
        return {
            year: { $year: '$date' },
            month: { $month: '$date' }
        };
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
}

export default new ReportService();
