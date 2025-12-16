import trailerService from "../services/trailerService.js";

class TrailerController {
    // @desc    Get all trailers
    // @route   GET /api/trailers
    async getAllTrailers(req, res) {
        try {
            const trailers = await trailerService.findAll();
            res.status(200).json(trailers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // @desc    Get trailer by ID
    // @route   GET /api/trailers/:id
    async getTrailerById(req, res) {
        try {
            const trailer = await trailerService.findById(req.params.id);
            if (!trailer) {
                return res.status(404).json({ message: 'Trailer not found' });
            }
            res.status(200).json(trailer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // @desc    Create new trailer
    // @route   POST /api/trailers
    async createTrailer(req, res) { 
        try {
            const trailer = await trailerService.create(req.body);
            res.status(201).json(trailer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // @desc    Update trailer
    // @route   PATCH /api/trailers/:id
    async updateTrailer(req, res) {
        try {
            const trailer = await trailerService.update(req.params.id, req.body);
            if (!trailer) {
                return res.status(404).json({ message: 'Trailer not found' });
            }
            res.status(200).json(trailer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // @desc    Delete trailer
    // @route   DELETE /api/trailers/:id
    async deleteTrailer(req, res) {
        try {
            const trailer = await trailerService.delete(req.params.id);
            if (!trailer) { 
                return res.status(404).json({ message: 'Trailer not found' });
            }
            res.status(200).json({ message: 'Trailer deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Get available trailers for a date
    // @route   GET /api/trailers/disponibles?startAt=YYYY-MM-DD&endAt=YYYY-MM-DD
    async getAvailableTrailers(req, res) {
        try {
            const { startAt, endAt } = req.query;
            if (!startAt) {
                return res.status(400).json({ message: 'startAt est obligatoire' });
            }
            const trailers = await trailerService.findAvailableTrailers(startAt, endAt);
            res.status(200).json(trailers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new TrailerController();
