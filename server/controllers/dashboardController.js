import dashboardService from '../services/dashboardService.js';

class DashboardController {
    // @desc    Get dashboard statistics
    // @route   GET /api/dashboard/stats
    async getStats(req, res) {
        try {
            const stats = await dashboardService.getStats();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get recent trips
    // @route   GET /api/dashboard/recent-trips
    async getRecentTrips(req, res) {
        try {
            const trips = await dashboardService.getRecentTrips();
            res.status(200).json(trips);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get vehicles needing attention
    // @route   GET /api/dashboard/vehicles-attention
    async getVehiclesNeedingAttention(req, res) {
        try {
            const vehicles = await dashboardService.getVehiclesNeedingAttention();
            res.status(200).json(vehicles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get fuel chart data
    // @route   GET /api/dashboard/fuel-chart?period=month
    async getFuelChartData(req, res) {
        try {
            const { period = 'month' } = req.query;
            const data = await dashboardService.getFuelChartData(period);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get kilometrage chart data
    // @route   GET /api/dashboard/kilometrage-chart?period=month
    async getKilometrageChartData(req, res) {
        try {
            const { period = 'month' } = req.query;
            const data = await dashboardService.getKilometrageChartData(period);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new DashboardController();
