import trailerService from '../services/trailerService.js';
import Trip from '../models/Trip.js';

class TrailerController {
    async getAllTrailers(req, res) {
        try {
            const trailers = await trailerService.findAll();
            res.status(200).json(trailers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTrailerById(req, res) {
        try {
            const trailer = await trailerService.findById(req.params.id);
            if (!trailer) return res.status(404).json({ message: 'Trailer not found' });
            res.status(200).json(trailer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createTrailer(req, res) { 
        try {
            const trailer = await trailerService.create(req.body);
            res.status(201).json(trailer);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateTrailer(req, res) {
        try {
            const trailer = await trailerService.update(req.params.id, req.body);
            if (!trailer) return res.status(404).json({ message: 'Trailer not found' });
            res.status(200).json(trailer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteTrailer(req, res) {
        try {
            const trailer = await trailerService.delete(req.params.id);
            if (!trailer) return res.status(404).json({ message: 'Trailer not found' });
            res.status(200).json({ message: 'Trailer deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAvailableTrailers(req, res) {
        try {
            const { startAt, endAt } = req.query;
            if (!startAt) return res.status(400).json({ message: 'startAt est obligatoire' });
            
            const trailers = await trailerService.findAvailable(startAt, endAt);
            res.status(200).json(trailers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTrailerWithTires(req, res) {
        try {
            const result = await trailerService.findWithTires(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new TrailerController();
