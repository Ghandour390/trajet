import reportService from '../services/reportService.js';

class ReportController {
    // @desc    Get report statistics
    // @route   GET /api/reports/stats?period=month
    async getReportStats(req, res) {
        try {
            const { period = 'month' } = req.query;
            const stats = await reportService.getStats(period);
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ReportController();
